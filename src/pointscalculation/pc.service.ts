import { prisma } from "../config/prisma.ts";
import type { CalculatePointsSchemaType, GenerateMatchLeaderboardSchemaType, GenerateMatchwiseLeagueLeaderboardSchemaType, GenerateSeasonLeagueLeaderboardSchemaType } from "./pc.schema.ts";
import { BadRequestError } from "../errors/HttpError.ts";
import { updateMatchStatus } from "../services/matchstatusupdate.service.ts";
import {redis} from "../config/redis.ts";
import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "pc_debug.log");

const writeLog = (message: string) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
};

export const getResolvedQuestions = async (matchId: number) => {
    const resolvedQuestions = await prisma.question.findMany({
        where: {
            matchId: matchId,
            questionStatus: {
                in: [3, 4]
            }
        },
        include: {
            options: {
                where: {
                    isCorrect: true
                },
                select: {
                    optionId: true,
                    position: true,
                    points: true,
                    questionId: true
                }
            }
        }
    })

    return resolvedQuestions;
}

export const getUserPredictions = async (matchId: number) => {
    const userPredictions = await prisma.prediction.findMany({
        where: {
            matchId: matchId
        },
        select: {
            id: true,
            userId: true,
            matchId: true,
            hasBooster: true,
            points: true,
            answers: {
                select: {
                    id: true,
                    predictionId: true,
                    optionId: true,
                    questionId: true,
                    position: true
                }
            }
        }
    })

    return userPredictions;
}

export const calculatePoints = async (input: CalculatePointsSchemaType) => {
    const { matchId } = input
    writeLog(`[calculatePoints] Starting points calculation for matchId: ${matchId}`);

    const resolvedQuestions = await getResolvedQuestions(matchId)
    writeLog(`[calculatePoints] Found ${resolvedQuestions.length} resolved questions for matchId: ${matchId}`);

    if (!resolvedQuestions.length) {  // check if there are any resolved questions
        writeLog(`[calculatePoints] WARN: No resolved questions found for matchId: ${matchId}`);
        throw new BadRequestError('No resolved questions found')
    }

    const userPredictions = await getUserPredictions(matchId)  // get all user predictions for the match
    writeLog(`[calculatePoints] Found ${userPredictions.length} user predictions for matchId: ${matchId}`);

    for (const prediction of userPredictions) {
        let totalPoints = 0;

        for (const answer of prediction.answers) {
            const question = resolvedQuestions.find((q: any) => q.id === answer.questionId)

            if (!question) {
                continue;
            }

            const correctOption = question.options.find((o: any) => o.optionId === answer.optionId)
            if (correctOption && correctOption.position === answer.position) {
                totalPoints += correctOption.points;
            }
        }

        if (prediction.hasBooster) {
            totalPoints *= 2;
        }

        writeLog(`[calculatePoints] Updating prediction ${prediction.id} (User: ${prediction.userId}) with points: ${totalPoints}`);
        await prisma.prediction.update({
            where: { id: prediction.id },
            data: { points: totalPoints }
        })
    }

    writeLog(`[calculatePoints] Generating leaderboards for matchId: ${matchId}`);
    await generateMatchLeaderboard(matchId)
    await generateSeasonLeaderboard(matchId)

    const activeLeagues = await prisma.league.findMany({
        where: {
            isDeleted: false
        }
    })
    writeLog(`[calculatePoints] Found ${activeLeagues.length} active leagues to update`);

    for (const league of activeLeagues) {
        writeLog(`[calculatePoints] Generating leaderboards for leagueId: ${league.id}`);
        await generateMatchwiseLeagueLeaderboard(league.id, matchId)
        await generateSeasonLeagueLeaderboard(league.id)
    }

    writeLog(`[calculatePoints] Updating match status to completed (status 4) for matchId: ${matchId}`);
    await updateMatchStatus(matchId, 4)

    // open next match 

    const nextMatch = await prisma.match.findFirst({
        where: {
            matchId: { gt: matchId }
        },
        orderBy: {
            matchId: 'asc'
        }
    })

    if (nextMatch && nextMatch.status === 0) {
        writeLog(`[calculatePoints] Opening next matchId: ${nextMatch.matchId}`);
        await updateMatchStatus(nextMatch.matchId, 1)
    } else if (nextMatch) {
        writeLog(`[calculatePoints] Next matchId ${nextMatch.matchId} already has status ${nextMatch.status}, skipping status update.`);
    } else {
        writeLog(`[calculatePoints] No next match found after matchId ${matchId}.`);
    }

    writeLog(`[calculatePoints] Points calculation successfully completed for matchId: ${matchId}`);
    return { status: 'success', message: "PC DONE" };
}

export const generateMatchLeaderboard = async (matchId: number) => {
    writeLog(`[generateMatchLeaderboard] Generating match leaderboard for matchId: ${matchId}`);

    await redis.del(`leaderboard:match:${matchId}:zset`);

    const userPoints = await prisma.prediction.groupBy({
        by: ['userId'],
        where: {
            matchId: matchId
        },
        _sum: {
            points: true
        }
    })

    writeLog(`[generateMatchLeaderboard] Aggregated user points count: ${userPoints.length}`);

    for (const entry of userPoints){
        const userId = entry.userId;
        const points = entry._sum.points || 0;

        await redis.zadd(`leaderboard:match:${matchId}:zset`,points, userId);
    }
    const sortUsers = userPoints.sort((a:any, b:any) => (b._sum.points || 0) - (a._sum.points || 0)) // sort users by points in descending order

    writeLog(`[generateMatchLeaderboard] Sorted users ranking order: ${JSON.stringify(sortUsers)}`);

    let currentRank = 1;
    let previousPoints: number | null = null;
    let skip = 0;  // to skip users with same points
    let rowNumber = 1;

    const ranksToUpdate = [];

    for (const user of sortUsers) {
        const points = user._sum.points || 0; // get total points for the user

        const rno = rowNumber;

        if (points === previousPoints) {
            skip++; // increment skip if points are different
        }
        else {
            currentRank = skip + 1; // set current rank to skip + 1
            skip = 1;  // reset skip to 1
            previousPoints = points;
        }

        const existingResult = await prisma.matchLeaderboard.findUnique({
            where: {
                userId_matchId: {
                    userId: user.userId,
                    matchId: matchId
                }
            }
        })

        const prvRank = existingResult ? existingResult.rank : 0;
        const prvPoints = existingResult ? existingResult.points : 0;

        let trend = 'NEW';

        if (existingResult) {
            if (currentRank < prvRank) {
                trend = 'UP';
            }
            else if (currentRank > prvRank) {
                trend = 'DOWN';
            }
            else {
                trend = 'SAME';
            }
        }

        writeLog(`[generateMatchLeaderboard] User ${user.userId}: Rank=${currentRank}, Points=${points}, Trend=${trend}`);

        ranksToUpdate.push({
            userId: user.userId,
            matchId: matchId,
            points: points,
            rno: rno,
            rank: currentRank,
            prvPoints: prvPoints,
            prvRank: prvRank,
            trend: trend
        })

        rowNumber++;
    }

    for (const record of ranksToUpdate) {
        await prisma.matchLeaderboard.upsert({
            where: {
                userId_matchId: {
                    userId: record.userId,
                    matchId: record.matchId
                }
            },
            update: {
                points: record.points,
                rank: record.rank,
                rno: record.rno,
                prvPoints: record.prvPoints,
                prvRank: record.prvRank,
                trend: record.trend
            },
            create: {
                userId: record.userId,
                matchId: record.matchId,
                points: record.points,
                rank: record.rank,
                rno: record.rno,
                prvPoints: record.prvPoints,
                prvRank: record.prvRank,
                trend: record.trend
            }
        });
    }
    writeLog(`[generateMatchLeaderboard] Successfully generated match leaderboard for matchId: ${matchId}`);
    return { status: 'success', message: "Match leaderboard generated successfully" };
}

export const generateSeasonLeaderboard = async (matchId: number) => {
    writeLog(`[generateSeasonLeaderboard] Generating season leaderboard`);

    await redis.del(`leaderboard:season`)

    const userPoints = await prisma.matchLeaderboard.groupBy({
        by: ['userId'],
        _sum: {
            points: true
        }
    })

    writeLog(`[generateSeasonLeaderboard] Aggregated season user points count: ${userPoints.length}`);

    for (const entry of userPoints){
        const userId = entry.userId;
        const points = entry._sum.points || 0;

        await redis.zadd(`leaderboard:season`, points, userId);
    }

    const sortUsers = userPoints.sort((a:any, b:any) => (b._sum.points || 0) - (a._sum.points || 0))

    let currentRank = 1;
    let previousPoints: number | null = null;
    let skip = 0;
    let rowNumber = 1;

    const ranksToUpdate = [];

    for (const user of sortUsers) {
        const points = user._sum.points || 0;

        const rno = rowNumber;

        if (points === previousPoints) {
            skip++;
        }
        else {
            currentRank = skip + 1;
            skip = 1;
            previousPoints = points;
        }

        const existingResult = await prisma.seasonLeaderboard.findUnique({
            where: {
                userId: user.userId
            }
        })

        const prvRank = existingResult ? existingResult.rank : 0;
        const prvPoints = existingResult ? existingResult.points : 0;

        let trend = 'NEW';

        if (existingResult) {
            if (currentRank < prvRank) {
                trend = 'UP';
            }
            else if (currentRank > prvRank) {
                trend = 'DOWN';
            }
            else {
                trend = 'SAME';
            }
        }

        ranksToUpdate.push({
            userId: user.userId,
            points: points,
            rank: currentRank,
            rno: rno,
            prvPoints: prvPoints,
            prvRank: prvRank,
            trend: trend
        })

        rowNumber++;
    }

    for (const record of ranksToUpdate) {
        await prisma.seasonLeaderboard.upsert({
            where: {
                userId: record.userId
            },
            update: {
                points: record.points,
                rank: record.rank,
                rno: record.rno,
                prvPoints: record.prvPoints,
                prvRank: record.prvRank,
                trend: record.trend
            },
            create: {
                userId: record.userId,
                points: record.points,
                rank: record.rank,
                rno: record.rno,
                prvPoints: record.prvPoints,
                prvRank: record.prvRank,
                trend: record.trend
            }
        })
    }
    writeLog(`[generateSeasonLeaderboard] Successfully generated season leaderboard`);
    return { status: 'success', message: "Season leaderboard generated successfully" };
}

export const generateMatchwiseLeagueLeaderboard = async (leagueId: number, matchId: number) => {
    writeLog(`[generateMatchwiseLeagueLeaderboard] Generating matchwise league leaderboard for leagueId: ${leagueId}, matchId: ${matchId}`);

    await redis.del(`leaderboard:league:matchwise:${leagueId}:${matchId}`);

    const league = await prisma.league.findUnique({
        where: { id: leagueId },
        select: { templateId: true }
    });

    if (!league) {
        writeLog(`[generateMatchwiseLeagueLeaderboard] WARN: League not found: ${leagueId}`);
        throw new BadRequestError('League not found');
    }

    const { templateId } = league;

    // 1. Get all active members of this specific league
    const members = await prisma.leagueMember.findMany({
        where: {
            leagueId: leagueId,
            isDisjoined: false,
            isRemoved: false,
        },
        select: { userId: true }
    });

    const memberUserIds = members.map((m:any) => m.userId);
    writeLog(`[generateMatchwiseLeagueLeaderboard] Found ${memberUserIds.length} active members in leagueId: ${leagueId}`);

    // 2. Get points for these members from the match predictions
    const userPoints = await prisma.prediction.groupBy({
        by: ['userId'],
        where: {
            matchId: matchId,
            userId: { in: memberUserIds }
        },
        _sum: {
            points: true
        }
    })

    for(const user of userPoints){
        const userId = user.userId;
        const points = user._sum.points || 0;
        await redis.zadd(`leaderboard:league:matchwise:${leagueId}:${matchId}`, points, userId);
    }

    const sortUsers = userPoints.sort((a:any, b:any) => (b._sum.points || 0) - (a._sum.points || 0))

    let currentRank = 1;
    let previousPoints: number | null = null;
    let skip = 0;
    let rowNumber = 1;

    const ranksToUpdate = [];

    for (const user of sortUsers) {
        const points = user._sum.points || 0;

        const rno = rowNumber;

        if (points === previousPoints) {
            skip++;
        }
        else {
            currentRank = skip + 1;
            skip = 1;
            previousPoints = points;
        }

        const existingResult = await prisma.leagueMatchwiseLeaderboard.findUnique({
            where: {
                userId_matchId_leagueId: {
                    userId: user.userId,
                    matchId: matchId,
                    leagueId: leagueId
                }
            }
        })

        const prvRank = existingResult ? existingResult.rank : 0;
        const prvPoints = existingResult ? existingResult.points : 0;

        let trend = 'NEW';

        if (existingResult) {
            if (currentRank < prvRank) {
                trend = 'UP';
            }
            else if (currentRank > prvRank) {
                trend = 'DOWN';
            }
            else {
                trend = 'SAME';
            }
        }

        ranksToUpdate.push({
            userId: user.userId,
            leagueId: leagueId,
            matchId: matchId,
            templateId: templateId,
            points: points,
            rank: currentRank,
            rno: rno,
            prvPoints: prvPoints,
            prvRank: prvRank,
            trend: trend
        })

        rowNumber++;
    }

    for (const record of ranksToUpdate) {
        await prisma.leagueMatchwiseLeaderboard.upsert({
            where: {
                userId_matchId_leagueId: {
                    userId: record.userId,
                    matchId: record.matchId,
                    leagueId: record.leagueId
                }
            },
            update: {
                points: record.points,
                rank: record.rank,
                rno: record.rno,
                prvPoints: record.prvPoints,
                prvRank: record.prvRank,
                trend: record.trend
            },
            create: {
                userId: record.userId,
                leagueId: record.leagueId,
                matchId: record.matchId,
                templateId: record.templateId,
                points: record.points,
                rank: record.rank,
                rno: record.rno,
                prvPoints: record.prvPoints,
                prvRank: record.prvRank,
                trend: record.trend
            }
        })
    }
    writeLog(`[generateMatchwiseLeagueLeaderboard] Successfully generated matchwise league leaderboard for leagueId: ${leagueId}`);
    return { status: 'success', message: "Matchwise league leaderboard generated successfully" };
}

export const generateSeasonLeagueLeaderboard = async (leagueId: number) => {
    writeLog(`[generateSeasonLeagueLeaderboard] Generating season league leaderboard for leagueId: ${leagueId}`);

    await redis.del(`leaderboard:season:league:${leagueId}`)

    const league = await prisma.league.findUnique({
        where: { id: leagueId },
        select: { templateId: true }
    });

    if (!league) {
        writeLog(`[generateSeasonLeagueLeaderboard] WARN: League not found: ${leagueId}`);
        throw new BadRequestError('League not found');
    }

    const { templateId } = league;

    // 1. Get all active members of this specific league
    const members = await prisma.leagueMember.findMany({
        where: {
            leagueId: leagueId,
            isDisjoined: false,
            isRemoved: false
        },
        select: { userId: true }
    });

    const memberUserIds = members.map((m:any) => m.userId);

    // 2. Aggregate points from all match-level leaderboards for this league
    const userPoints = await prisma.leagueMatchwiseLeaderboard.groupBy({
        by: ['userId'],
        where: {
            leagueId: leagueId,
            userId: { in: memberUserIds }
        },
        _sum: {
            points: true
        }
    })

    // REDIS
    for(const user of userPoints){
        const userId = user.userId;
        const points = user._sum.points || 0;
        await redis.zadd(`leaderboard:season:league:${leagueId}`, points, userId);
    }

    const sortUsers = userPoints.sort((a:any, b:any) => (b._sum.points || 0) - (a._sum.points || 0))

    let currentRank = 1;
    let previousPoints: number | null = null;
    let skip = 0;
    let rowNumber = 1;

    const ranksToUpdate = [];

    for (const user of sortUsers) {
        const points = user._sum.points || 0;

        const rno = rowNumber;

        if (points === previousPoints) {
            skip++;
        }
        else {
            currentRank = skip + 1;
            skip = 1;
            previousPoints = points;
        }

        const existingResult = await prisma.leagueSeasonLeaderboard.findUnique({
            where: {
                userId_leagueId: {
                    userId: user.userId,
                    leagueId: leagueId
                }
            }
        })

        const prvRank = existingResult ? existingResult.rank : 0;
        const prvPoints = existingResult ? existingResult.points : 0;

        let trend = 'NEW';

        if (existingResult) {
            if (currentRank < prvRank) {
                trend = 'UP';
            }
            else if (currentRank > prvRank) {
                trend = 'DOWN';
            }
            else {
                trend = 'SAME';
            }
        }

        ranksToUpdate.push({
            userId: user.userId,
            leagueId: leagueId,
            points: points,
            templateId: templateId,
            rank: currentRank,
            rno: rno,
            prvPoints: prvPoints,
            prvRank: prvRank,
            trend: trend
        })

        rowNumber++;
    }

    for (const record of ranksToUpdate) {
        await prisma.leagueSeasonLeaderboard.upsert({
            where: {
                userId_leagueId: {
                    userId: record.userId,
                    leagueId: record.leagueId
                }
            },
            update: {
                points: record.points,
                rank: record.rank,
                rno: record.rno,
                prvPoints: record.prvPoints,
                prvRank: record.prvRank,
                trend: record.trend
            },
            create: {
                userId: record.userId,
                leagueId: record.leagueId,
                points: record.points,
                rank: record.rank,
                rno: record.rno,
                templateId: record.templateId,
                prvPoints: record.prvPoints,
                prvRank: record.prvRank,
                trend: record.trend
            }
        })
    }
    writeLog(`[generateSeasonLeagueLeaderboard] Successfully generated season league leaderboard for leagueId: ${leagueId}`);
    return { status: 'success', message: "Season league leaderboard generated successfully" };
}
