import { prisma } from '../config/prisma.ts'
import type { FastifyRequest } from "fastify"
import type { GetLeagueMatchwiseLeaderboardSchemaType, GetLeagueSeasonLeaderboardSchemaType } from './leaderboard.schema.ts'
import { redis } from "../config/redis.ts"

export const getMatchLeaderboard = async (req: FastifyRequest) => {
    const { matchId } = req.params as { matchId: string }

    const cacheKey = `leaderboard:match:${matchId}:zset`;

    // Get the top 50 users from the Sorted Set
    // 'WITHSCORES' gives you [userId, points, userId, points...]
    let rawData: string[] = [];
    try {
        rawData = await redis.zrevrange(cacheKey, 0, 49, 'WITHSCORES');
    } catch (err) {
        console.error("[Redis Cache Error] Failed to fetch match leaderboard from Redis:", err);
    }

    if (rawData.length > 0) {
       // Transform the flat array into a nice JS object
       // (Since Redis returns a flat list, we group them into pairs)
       const leaderboard = [];
       const userIds: string[] = [];  // Explicitly tell TS this is an array of strings

       for(let i = 0; i < rawData.length; i += 2) {
            const userId = rawData[i];

        // 2. Only push if the userId exists (this satisfies the 'undefined' check)
        if (userId){
            userIds.push(userId);
           leaderboard.push({ 
            userId: rawData[i],
            points: Number(rawData[i + 1]),
            rank: (i/2) + 1
            });
        }
    }

       const users = await prisma.user.findMany({
        where:{id: { in: userIds}},
        select:{
            id: true,
            username: true
        }
       });

        // Merge the usernames back into your leaderboard array
       const finalData = leaderboard.map(entry => ({
        ...entry,
        user:{
            username: users.find((u:any) => u.id == entry.userId)?.username || 'Unknown'
        }
       }))

       return {
           status: 'success',
           message: 'Real-time leaderboard fetched from Redis',
           data: finalData
       }
    }

    const matchLeaderboard = await prisma.matchLeaderboard.findMany({
        where: {
            matchId: Number(matchId)
        },
        orderBy: {
            rno: 'asc'
        },
        select: {
            userId: true,
            matchId: true,
            rno: true,
            points: true,
            rank: true,
            prvPoints: true,
            prvRank: true,
            trend: true,
            user: {
                select: {
                    username: true
                }
            }
        }
    })

    // await redis.setex(cacheKey, 3600, JSON.stringify(matchLeaderboard));

    return {
        status: 'success',
        message: 'Match leaderboard fetched successfully',
        data: matchLeaderboard
    }
}

export const getUserMatchLeaderboard = async (req: FastifyRequest) => {
    const { matchId } = req.params as { matchId: string }
    const userId = req.user.id

    const userMatchLeaderboard = await prisma.matchLeaderboard.findUnique({
        where: {
            userId_matchId: {
                userId: userId,
                matchId: Number(matchId)
            }
        },
        select: {
            userId: true,
            matchId: true,
            rno: true,
            points: true,
            rank: true,
            prvPoints: true,
            prvRank: true,
            trend: true,
            user: {
                select: {
                    username: true
                }
            }
        }
    })


    return {
        status: 'success',
        message: 'User match leaderboard fetched successfully',
        data: userMatchLeaderboard
    }
}

export const getSeasonLeaderboard = async (req: FastifyRequest) => {

    const cacheKey = `leaderboard:season`;

    let rawData: string[] = [];
    try {
        rawData = await redis.zrevrange(cacheKey, 0, 49, 'WITHSCORES');
    } catch (err) {
        console.error("[Redis Cache Error] Failed to fetch season leaderboard from Redis:", err);
    }

    if(rawData.length > 0) {
        const leaderboard = [];
        const userIds: string[] = [];

        for(let i = 0; i < rawData.length; i += 2) {
            const userId = rawData[i];
            if(userId) {
                userIds.push(userId);
                leaderboard.push({
                    userId: rawData[i],
                    points: Number(rawData[i + 1]),
                    rank: (i/2) + 1
                });
            }
        }

        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                username: true
            }
        })

        const finalData = leaderboard.map((entry: any) => ({
            ...entry,
            user: users.find((user: any) => user.id === entry.userId)
        }))
        
        return {
            status: 'success',
            message: 'Real-time season leaderboard fetched from Redis',
            data: finalData
        }
    }
    
    const seasonLeaderboard = await prisma.seasonLeaderboard.findMany({
        orderBy: {
            rank: 'asc'
        },
        select: {
            userId: true,
            points: true,
            rank: true,
            rno: true,
            prvPoints: true,
            prvRank: true,
            trend: true,
            user: {
                select: {
                    username: true
                }
            }
        }
    })

    // await redis.setex(cacheKey, 3600, JSON.stringify(seasonLeaderboard));

    return {
        status: 'success',
        message: 'Season leaderboard fetched successfully',
        data: seasonLeaderboard
    }

}

export const getUserSeasonLeaderboard = async (req: FastifyRequest) => {
    const userId = req.user.id
    

    const userSeasonLeaderboard = await prisma.seasonLeaderboard.findUnique({
        where: {
            userId: userId
        },
        select: {
            userId: true,
            points: true,
            rank: true,
            rno: true,
            prvPoints: true,
            prvRank: true,
            trend: true,
            user: {
                select: {
                    username: true
                }
            }
        }
    })
    return {
        status: 'success',
        message: 'User season leaderboard fetched successfully',
        data: userSeasonLeaderboard
    }
}


// --------------------GET LEAGUE MATCH LEADERBOARD--------------------
export const getLeagueMatchwiseLeaderboard =  async (req: FastifyRequest) => {
    const { leagueId, matchId } = req.params as { leagueId: string, matchId: string }

    const cacheKey = `leaderboard:league:matchwise:${leagueId}:${matchId}`
     
    let rawData: string[] = [];
    try {
        rawData = await redis.zrevrange(cacheKey, 0, -1, 'WITHSCORES');
    } catch (err) {
        console.error("[Redis Cache Error] Failed to fetch league matchwise leaderboard from Redis:", err);
    }

    if(rawData.length > 0) {
        const leaderboard = [];
        const userIds: string[] = [];
        
        for(let i = 0; i < rawData.length; i += 2) {
            const userId = rawData[i];
            if(userId) {
                userIds.push(userId);
                leaderboard.push({
                    userId: rawData[i],
                    points: Number(rawData[i + 1]),
                    rank: (i/2) + 1
                });
            }
        }

        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                username: true
            }
        })

        const finalData = leaderboard.map((entry: any) => ({
            ...entry,
            user: users.find((user: any) => user.id === entry.userId)
        }))
        return {
            status: 'success',
            message: 'Real-time league matchwise leaderboard fetched from Redis',
            data: finalData
        }
    }

    const rankings = await prisma.leagueMatchwiseLeaderboard.findMany({
        where: { 
            leagueId: Number(leagueId), 
            matchId: Number(matchId) 
        },
        include: {
            user: {
                select: { username: true }
            },
            league: {
                select: { leagueName: true, templateId: true }
            }
        },
        orderBy: { rank: 'asc' } 
    });
    return { data: rankings };
}

// --------------------GET PRIVATE LEAGUE SEASON LEADERBOARD--------------------
export const getLeagueSeasonLeaderboard = async (req: FastifyRequest) => {
    const { leagueId } = req.params as { leagueId: string }

    const cacheKey = `leaderboard:season:league:${leagueId}`

    let rawData: string[] = [];
    try {
        rawData = await redis.zrevrange(cacheKey, 0, -1, 'WITHSCORES');
    } catch (err) {
        console.error("[Redis Cache Error] Failed to fetch league season leaderboard from Redis:", err);
    }

    if(rawData.length > 0) {
        const leaderboard = [];
        const userIds: string[] = [];
        
        for(let i = 0; i < rawData.length; i += 2) {
            const userId = rawData[i];
            if(userId) {
                userIds.push(userId);
                leaderboard.push({
                    userId: rawData[i],
                    points: Number(rawData[i + 1]),
                    rank: (i/2) + 1
                });
            }
        }

        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                username: true
            }
        })

        const finalData = leaderboard.map((entry: any) => ({
            ...entry,
            user: users.find((user: any) => user.id === entry.userId)
        }))
        
        return {
            status: 'success',
            message: 'Real-time league season leaderboard fetched from Redis',
            data: finalData
        }
    }

    const rankings = await prisma.leagueSeasonLeaderboard.findMany({
        where: { 
            leagueId: Number(leagueId)
        },
        include: {
            league: {
                select: { leagueName: true, templateId: true }
            },
            user: {
                select: { username: true }
            }
        },
        orderBy: { rank: 'asc' }
    });

//    await redis.setex(cacheKey, 3600, JSON.stringify(rankings));

    return { data: rankings };

    // Save the fresh data into Redis so the NEXT user gets it fast.
    // 'setex' stands for "Set with Expiration"
    // cacheKey: our unique identifier
    // 3600: Time to Live (TTL) in seconds. This means the cache expires in 1 hour.
    // JSON.stringify: Converts our object into a string for Redis.

    // Return data after storing it in cache

}



