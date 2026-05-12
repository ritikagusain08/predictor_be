import { prisma } from '../config/prisma.ts'
import type { CreatePlayerSchemaType } from './player.schema.ts'
import { BadRequestError } from '../errors/HttpError.ts'

export const createPlayer = async (data: CreatePlayerSchemaType) => {
    const { playerId, playerName, playerSkill, isActive, teamId } = data

    const existingPlayer = await prisma.player.findUnique({
        where: {
            playerId: playerId
        }
    })

    if (existingPlayer) {
        await prisma.player.update({
            where: {
                playerId: playerId
            },
            data: {
                playerName: playerName,
                playerSkill: playerSkill,
                isActive: isActive,
                teamId: teamId
            },
            include: {
                team: true
            }
        })
        return existingPlayer
    }

    const player = await prisma.player.create({
        data: {
            playerId: playerId,
            playerName: playerName,
            playerSkill: playerSkill,
            isActive: isActive,
            teamId: teamId
        },
        include: {
            team: true
        }
    })
    return player
}

export const getPlayerById = async (playerId: string) => {
    const player = await prisma.player.findUnique({
        where: {
            playerId: playerId
        },
        include: {
            team: true
        }
    })
    return player
}

export const getPlayers = async () => {
    const players = await prisma.player.findMany({
        include: {
            team: true
        }
    })
    return players
}