import { prisma } from "../config/prisma.js"
import { BadRequestError } from "../errors/HttpError.js"
import type { CreateAdminLeagueSchemaType, UpdateAdminLeagueSchemaType } from "./adminLeague.schema.ts"


export const createAdminLeague = async (data: CreateAdminLeagueSchemaType) => {
    const { leagueName, templateId, userId, createdAtMatchId, startMatchId, endMatchId, maximumMembers } = data

    const template = await prisma.leagueTemplate.findUnique({
        where: { id: templateId }
    })

    if (!template) {
        throw new BadRequestError("League Template not found")
    }

    if (template.creatorRole !== "ADMIN") {
        throw new BadRequestError("The selected template is not for Admin-created leagues")
    }

    // league code should start from league type first letter 
    let leagueCode = template.name.charAt(0).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();

    const leagueExists = await prisma.league.findUnique({
        where: { leagueCode: leagueCode }
    })

    if (leagueExists) {
        leagueCode = template.name.charAt(0).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    const match = await prisma.match.findUnique({
        where: { matchId: createdAtMatchId }
    })

    if (!match) {
        throw new BadRequestError(`Match with ID ${createdAtMatchId} not found.`)
    }

    const newLeague = await prisma.league.create({
        data: {
            leagueName: leagueName,
            leagueCode: leagueCode,
            templateId: templateId,
            userId: userId,
            createdAtMatchId: createdAtMatchId,
            startMatchId: startMatchId ?? null,
            endMatchId: endMatchId ?? null,
            maximumMembers: maximumMembers ?? template.defaultMaxMembers,
            membersCount: 1,
        }
    })

    await prisma.leagueMember.create({
        data: {
            leagueId: newLeague.id,
            userId: userId,
            joinedAtMatchId: createdAtMatchId,
            isAdmin: true
        }
    })

    return {
        message: "Admin league created successfully",
        data: newLeague
    }
}

export const getAdminLeagues = async () => {
    const leagues = await prisma.league.findMany({
        where: {
            template: {
                creatorRole: "ADMIN"
            }
        },
        include: {
            template: true
        }
    })
    return {
        message: "Admin leagues fetched successfully",
        data: leagues
    }
}

export const updateAdminLeague = async (data: UpdateAdminLeagueSchemaType) => {
    const {id, ...fields} = data

    if(id === undefined){
        throw new BadRequestError("ID is required for update")
    }

    const isLeagueExist = await prisma.league.findFirst({
        where: {
            id
        }
    })

    if(!isLeagueExist){
        throw new BadRequestError("League does not exist")
    }

    const updateData = Object.fromEntries(Object.entries(fields).filter(([_, value]) => value !== undefined));

    const updatedLeague = await prisma.league.update({
        where: {
            id
        },
        data: updateData
    })
    return { message: "League Updated Successfully" , data: updatedLeague}
}

export const deleteAdminLeague = async (id: number) => {

    const isLeagueExist = await prisma.league.findFirst({
        where: {
            id
        }
    })

    if(!isLeagueExist){
        throw new BadRequestError("League does not exist")
    }

    const deletedLeague = await prisma.league.delete({
        where: {
            id
        }
    })
    return { message: "League Deleted Successfully" , data: deletedLeague}
}

