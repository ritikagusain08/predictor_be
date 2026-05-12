import { prisma } from '../config/prisma.ts'
import type { CreateTeamSchemaType } from './team.schema.ts'
import { BadRequestError } from '../errors/HttpError.ts'

export const createTeam = async (data: CreateTeamSchemaType) => {
    const { teamId, teamName, teamShortName } = data

    const existingTeam = await prisma.team.findUnique({
        where: {
            teamId: teamId
        }
    })

    if (existingTeam) {
        await prisma.team.update({
            where: {
                teamId: teamId
            },
            data: {
                teamName: teamName,
                teamShortName: teamShortName
            },
            include: {
                players: true
            }
        })
        return existingTeam
    }

    const team = await prisma.team.create({
        data: {
            teamId: teamId,
            teamName: teamName,
            teamShortName: teamShortName
        },
        include: {
            players: true
        }
    })
    return team
}


// get team by id
export const getTeamById = async (teamId: string) => {
    const team = await prisma.team.findUnique({
        where: {
            teamId: teamId
        },
        include: {
            players: true
        }
    })
    return team
}

export const getTeams = async () => {
    const teams = await prisma.team.findMany({
        include: {
            players: true
        }
    })
    return teams
}

