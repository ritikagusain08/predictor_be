import { prisma } from '../config/prisma.ts'
import type { CreateMatchSchemaType } from './match.schema.ts'
import { redis } from '../config/redis.ts'

export const createMatch = async (data: CreateMatchSchemaType) => {
    // invalidate cache when match is created
    const cacheKey = 'matches:all';
    await redis.del(cacheKey);

    const { matchId, gamedayId, circuitLocation, circuitShortName, season, status, sessionStartDate, sessionEndDate } = data

    const existingMatch = await prisma.match.findUnique({
        where: {
            matchId: matchId
        }
    })

    // if match already exists, then update the other fields
    if (existingMatch) {
        await prisma.match.update({
            where: {
                matchId: matchId
            },
            data: {
                gamedayId: gamedayId,
                circuitLocation: circuitLocation,
                circuitShortName: circuitShortName,
                sessionStartDate: sessionStartDate,
                sessionEndDate: sessionEndDate,
                season: season,
                status: status
            }
        })

        return existingMatch
    }

    const newMatch = await prisma.match.create({
        data: {
            matchId: matchId,
            gamedayId: gamedayId,
            circuitLocation: circuitLocation,
            circuitShortName: circuitShortName,
            sessionStartDate: sessionStartDate,
            sessionEndDate: sessionEndDate,
            season: season,
            status: status
        },
        select: {
            matchId: true,
            gamedayId: true,
            circuitLocation: true,
            circuitShortName: true,
            season: true,
            status: true
        }
    })

    return newMatch
}


export const getMatch = async (matchId: number) => {

    const match = await prisma.match.findUnique({
        where: {
            matchId: matchId
        },
        select: {
            matchId: true,
            gamedayId: true,
            circuitLocation: true,
            circuitShortName: true,
            sessionStartDate: true,
            sessionEndDate: true,
            season: true,
            status: true
        }
    })

    return match
}

export const getMatches = async () => {


    const cacheKey = 'matches:all';
    const cachedMatches = await redis.get(cacheKey);

    if (cachedMatches) {
        return JSON.parse(cachedMatches);
    }
    const matches = await prisma.match.findMany({
        select: {
            matchId: true,
            gamedayId: true,
            circuitLocation: true,
            circuitShortName: true,
            season: true,
            status: true
        }
    })

    await redis.setex(cacheKey, 3600, JSON.stringify(matches));

    return matches
}

