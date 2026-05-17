import { prisma } from "../config/prisma.ts"
import { BadRequestError } from "../errors/HttpError.ts"
import type { FastifyRequest } from "fastify"
import type { CreateLeagueSchemaType, UpdateLeagueSchemaType, JoinLeagueSchemaType, JoinLeagueByCodeSchemaType } from "./league.schema.ts"

export const createUserLeague = async (req: FastifyRequest) => {
    const { leagueName, templateId, maximumMembers } = req.body as CreateLeagueSchemaType
    const userId = req.user.id

    const template = await prisma.leagueTemplate.findUnique({
        where: { id: templateId }
    })

    if (!template) {
        throw new BadRequestError("League Template not found")
    }

    if (template.creatorRole !== "USER") {
        throw new BadRequestError("The selected template is not for User-created leagues")
    }

    // League code should start from template name first letter
    let leagueCode = template.name.charAt(0).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();

    const leagueExists = await prisma.league.findUnique({
        where: { leagueCode: leagueCode }
    })

    if (leagueExists) {
        leagueCode = template.name.charAt(0).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    // find the open match to create the league
    const openMatch = await prisma.match.findFirst({
        where: {
            status: 1
        }
    })

    if (!openMatch) {
        throw new BadRequestError("No active race sessions found. Check back when the season begins!")
    }


    const newLeague = await prisma.league.create({
        data: {
            leagueName: leagueName,
            leagueCode: leagueCode,
            templateId: templateId,
            userId: userId,
            maximumMembers: maximumMembers ?? template.defaultMaxMembers,
            membersCount: 1,
            createdAtMatchId: openMatch.matchId
        }
    })

    await prisma.leagueMember.create({
        data: {
            leagueId: newLeague.id,
            userId: userId,
            joinedAtMatchId: openMatch.matchId,
            isAdmin: true
        }
    })

    return {
        message: "Your custom league has been established! Welcome to the paddock.",
        data: newLeague
    }
}

// ---------------------------JOIN LEAGUE----------------------

export const joinUserLeague = async (req: FastifyRequest) => {
    const { leagueId } = req.body as JoinLeagueSchemaType
    const userId = req.user.id

    const league = await prisma.league.findUnique({
        where: { id: leagueId }
    })

    if (!league || league.isDeleted) {
        throw new BadRequestError("The requested league could not be found in the paddock.")
    }

    const template = await prisma.leagueTemplate.findUnique({
        where: { id: league.templateId }
    })

    if (!template) {
        throw new BadRequestError("League template not found")
    }

    if (template.requireLeagueCode) {
        throw new BadRequestError("League code is required to join this league")
    }

    if (league.membersCount >= league.maximumMembers) {
        throw new BadRequestError("The grid is full! This league has reached its maximum member limit.")
    }

    const userInLeague = await prisma.leagueMember.findUnique({
        where: { leagueId_userId: { leagueId: leagueId, userId: userId } }
    })

    if (userInLeague && !userInLeague.isDisjoined && !userInLeague.isRemoved) {
        throw new BadRequestError("You're already a confirmed driver in this league!")
    }

    const openMatch = await prisma.match.findFirst({
        where: {
            status: 1
        }
    })

    if (!openMatch) {
        throw new BadRequestError("No active race sessions found. Check back when the season begins!")
    }

    const joinedMember = await prisma.leagueMember.upsert({
        where: { leagueId_userId: { leagueId: leagueId, userId: userId } },
        update: {
            isDisjoined: false,
            isRemoved: false,
            joinedAtMatchId: openMatch.matchId
        },
        create: {
            leagueId: leagueId,
            userId: userId,
            joinedAtMatchId: openMatch.matchId,
            isAdmin: false
        },
        include: {
            league: {
                include: {
                    template: true,
                    _count: {
                        select: {
                            members: {
                                where: {
                                    isDisjoined: false,
                                    isRemoved: false
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    await prisma.league.update({
        where: { id: leagueId },
        data: {
            membersCount: {
                increment: 1
            }
        }
    })

    return {
        message: "Grid position confirmed! You've successfully joined the league.",
        data: {
            id: joinedMember.id,
            leagueName: joinedMember.league.leagueName,
            templateId: joinedMember.league.templateId,
            userId: joinedMember.userId,
            joinedAtMatchId: joinedMember.joinedAtMatchId
        }
    }
}

// ----------------------JOIN LEAGUE BY CODE----------------------
export const joinLeagueByCode = async (req: FastifyRequest) => {
    const { leagueCode } = req.body as JoinLeagueByCodeSchemaType
    const userId = req.user.id
    const normalizedCode = leagueCode.trim().toUpperCase()

    const league = await prisma.league.findUnique({
        where: { leagueCode: normalizedCode }
    })

    if (!league || league.isDeleted) throw new BadRequestError("The requested league could not be found.")

    const template = await prisma.leagueTemplate.findUnique({
        where: { id: league.templateId }
    })

    if (!template) throw new BadRequestError("League template not found")

    if (template.requireLeagueCode && !leagueCode) {
        throw new BadRequestError("League code is required to join this league")
    }

    if (league.membersCount >= league.maximumMembers) {
        throw new BadRequestError("The grid is full! This league has reached its maximum member limit.")
    }

    const userInLeague = await prisma.leagueMember.findUnique({
        where: { leagueId_userId: { leagueId: league.id, userId: userId } }
    })

    if (userInLeague && !userInLeague.isDisjoined && !userInLeague.isRemoved) {
        throw new BadRequestError("You're already a confirmed driver in this league!")
    }

    const openMatch = await prisma.match.findFirst({
        where: {
            status: 1
        }
    })

    if (!openMatch) {
        throw new BadRequestError("No active race sessions found. Check back when the season begins!")
    }

    const joinedLeagueMember = await prisma.leagueMember.upsert({
        where: { leagueId_userId: { leagueId: league.id, userId: userId } },
        update: {
            isDisjoined: false,
            isRemoved: false,
            joinedAtMatchId: openMatch.matchId
        },
        create: {
            leagueId: league.id,
            userId: userId,
            joinedAtMatchId: openMatch.matchId,
            isAdmin: false
        },
        include: {
            league: true
        }
    })

    await prisma.league.update({
        where: { id: league.id },
        data: {
            membersCount: {
                increment: 1
            }
        }
    })

    return {
        message: "Access granted! You've joined the league via invite code.",
        data: {
            id: joinedLeagueMember.id,
            leagueName: joinedLeagueMember.league.leagueName,
            templateId: joinedLeagueMember.league.templateId,
            userId: joinedLeagueMember.userId,
            joinedAtMatchId: joinedLeagueMember.joinedAtMatchId
        }
    }
}
// ----------------------UNJOINED LEAGUES----------------------

export const getUnjoinedLeagues = async (req: FastifyRequest) => {
    const userId = req.user.id
    const unjoinedLeagues = await prisma.league.findMany({
        where: {
            isDeleted: false,
            template: {
                requireLeagueCode: false
            },
            members: {
                none: {
                    userId: userId,
                    isDisjoined: false,
                    isRemoved: false
                }
            }
        },
        include: {
            template: true,
            _count: {
                select: {
                    members: true
                }
            }
        }
    })

    return {
        message: "Available competitions found. Ready to join the race?",
        data: unjoinedLeagues
    }
}

// ----------------------UPDATE LEAGUE----------------------

export const updateUserLeague = async (req: FastifyRequest) => {
    const { id, ...fields } = req.body as UpdateLeagueSchemaType

    const leagueExists = await prisma.league.findUnique({
        where: { id: id }
    })

    if (!leagueExists) {
        throw new BadRequestError("League not found")
    }

    const updatedLeague = await prisma.league.update({
        where: { id: id },
        data: fields
    })

    return {
        message: "League settings updated successfully.",
        data: updatedLeague
    }
}
// ----------------------DELETE LEAGUE----------------------
export const deleteLeague = async (req: FastifyRequest) => {
    const { leagueId } = req.body as { leagueId: number }
    const userId = req.user.id
    const leagueExists = await prisma.league.findUnique({
        where: { id: leagueId }
    })

    if (!leagueExists) {
        throw new BadRequestError("League not found")
    }

    // check if this template league allowed to be deleted
    const template = await prisma.leagueTemplate.findUnique({
        where: { id: leagueExists.templateId }
    })

    if (!template) {
        throw new BadRequestError("League template not found")
    }

    if (template.allowAdminDelete === false) {
        throw new BadRequestError("This League type does not allow deletion")
    }

    // check userid exists 
    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!userExists) {
        throw new BadRequestError("Driver profile not found.")
    }

    // check user id is owner of the league
    const leagueOwner = await prisma.league.findUnique({
        where: { id: leagueId }
    })

    if (leagueOwner?.userId !== userId) {
        throw new BadRequestError("Only the league host can perform this action.")
    }

    const updatedLeague = await prisma.league.update({
        where: { id: leagueId },
        data: {
            isDeleted: true
        }
    })

    return {
        message: "League disbanded. All records have been cleared from the grid.",
        data: updatedLeague
    }
}


// get all leagues
export const getAllLeagues = async (req: FastifyRequest) => {
    const userId = req.user.id;
    const leagues = await prisma.league.findMany({
        where: {
            isDeleted: false,
            members: {
                some: {
                    userId: userId,
                    isDisjoined: false,
                    isRemoved: false
                }
            }
        },
        include: {  
            // get all user created or joined league with is_admin, member_count and template key
            _count: {
                select: {
                    members: {
                        where: {
                            isDisjoined: false,
                            isRemoved: false
                        }
                    }
                }
            },
            template: true,
            user: {
                select: {
                    username: true
                }
            }

        }
    })

    return {
        message: "Your active leagues have been retrieved from the paddock.",
        data: leagues
    }
}
// get league info
export const getLeagueInfo = async (req: FastifyRequest) => {
    const { leagueId } = req.query as { leagueId: number }
    const league = await prisma.league.findUnique({
        where: { id: leagueId },
        include: {
            members: {
                where: {
                    isDisjoined: false,
                    isRemoved: false
                },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    members: {
                        where: {
                            isDisjoined: false,
                            isRemoved: false
                        }
                    }
                }
            },
            template: true,
            user: {
                select: {
                    username: true
                }
            }
        }
    })

    if (!league) {
        throw new BadRequestError("League not found")
    }

    return {
        message: "League details retrieved successfully.",
        data: league
    }
}

// ---------------------------DISJOIN LEAGUE----------------------

export const disjoinLeague = async (req: FastifyRequest) => {
    const { leagueId } = req.body as { leagueId: number }
    const userId = req.user.id
    const league = await prisma.league.findUnique({
        where: { id: leagueId }
    })

    if (!league) {
        throw new BadRequestError("League not found")
    }

    // check if user is a member of the league
    const leagueMember = await prisma.leagueMember.findUnique({
        where: { leagueId_userId: { leagueId: leagueId, userId: userId } }
    })

    if (!leagueMember) {
        throw new BadRequestError("User is not a member of the league")
    }

    // check if user is the owner of the league
    const leagueOwner = await prisma.league.findUnique({
        where: { id: leagueId }
    })

    if (leagueOwner?.userId === userId) {
        throw new BadRequestError("As the league host, you cannot leave your own paddock. You must delete the league to close it.")
    }

    // check if template allows user to leave
    const template = await prisma.leagueTemplate.findUnique({
        where: { id: league.templateId }
    })

    if (!template) {
        throw new BadRequestError("The blueprints for this league type are missing.")
    }

    if (template.allowUserLeave === false) {
        throw new BadRequestError("Contractual obligations: This league type does not allow drivers to leave mid-season.")
    }

    const updatedLeague = await prisma.league.update({
        where: { id: leagueId },
        data: {
            membersCount: league.membersCount - 1
        }
    })

    await prisma.leagueMember.update({
        where: { leagueId_userId: { leagueId: leagueId, userId: userId } },
        data: { isDisjoined: true }
    })

    return {
        message: "You have successfully exited the league paddock.",
        data: updatedLeague
    }
}
// ----------------------REMOVE MEMBER----------------------
export const removeMember = async (req: FastifyRequest) => {
    const { leagueId, memberId } = req.body as { leagueId: number, memberId: string }
    const userId = req.user.id
    const league = await prisma.league.findUnique({
        where: { id: leagueId }
    })

    if (!league) {
        throw new BadRequestError("The specified league was not found in the paddock.")
    }

    // check if user is a member of the league
    const userMember = await prisma.leagueMember.findUnique({
        where: { leagueId_userId: { leagueId: leagueId, userId: userId } }
    })

    const member = await prisma.leagueMember.findUnique({
        where: { leagueId_userId: { leagueId: leagueId, userId: memberId } }
    })

    if (!userMember || !member) {
        throw new BadRequestError("The driver is not currently registered on the league roster.")
    }

    // check if user is the owner of the league
    const leagueOwner = await prisma.league.findUnique({
        where: { id: leagueId }
    })

    if (leagueOwner?.userId === memberId) {
        throw new BadRequestError("The league host cannot be removed from their own roster.")
    }

    // check if template allows user to leave
    const template = await prisma.leagueTemplate.findUnique({
        where: { id: league.templateId }
    })

    if (!template) {
        throw new BadRequestError("League specifications not found.")
    }

    if (template.allowMemberRemoval === false) {
        throw new BadRequestError("Member removal is disabled for this league category.")
    }

    const updatedLeague = await prisma.league.update({
        where: { id: leagueId },
        data: {
            membersCount: league.membersCount - 1
        }
    })

    await prisma.leagueMember.update({
        where: { leagueId_userId: { leagueId: leagueId, userId: memberId } },
        data: { isRemoved: true }
    })

    return {
        message: "Driver has been removed from the league roster.",
        data: updatedLeague
    }
}

