// match status service 

import { prisma } from '../config/prisma.ts'
import { BadRequestError } from '../errors/HttpError.ts'
import { redis } from '../config/redis.ts'
import { predictionQueue } from '../jobs/queue.ts'

export const updateMatchStatus = async (matchId: number, status: number) => {


    const isValidMatch = await prisma.match.findUnique({
        where: {
            matchId: matchId
        }
    })

    if (!isValidMatch) {
        throw new BadRequestError('Match not found')
    }

    const validStatuses = [0, 1, 2, 3, 4]

    if (!validStatuses.includes(status)) {
        throw new BadRequestError('Invalid status')
    }

    const updatedMatchStatus = await prisma.match.update({
        where: {
            matchId: matchId
        },
        data: {
            status: status
        }
    })

    await redis.del('matches:all')


    if (updatedMatchStatus.status === 0) {
        await prisma.question.updateMany({
            where: {
                matchId: matchId
            },
            data: {
                questionStatus: 0
            }
        })

        return {
            message: 'Match is closed',
            status: updatedMatchStatus.status
        }
    }



    if (updatedMatchStatus.status === 1) {
        await prisma.question.updateMany({
            where: {
                matchId: matchId
            },
            data: {
                questionStatus: 1
            }
        })

        // message to frontend that match is open
        return {
            message: 'Match is open',
            status: updatedMatchStatus.status
        }
    }

    if (updatedMatchStatus.status === 2) {
        await prisma.question.updateMany({
            where: {
                matchId: matchId
            },
            data: {
                questionStatus: 2
            }
        })
        return {
            message: 'Match is locked',
            status: updatedMatchStatus.status
        }
    }

    if (updatedMatchStatus.status === 3) {
        // We REMOVED the cascading update for status 3 to prevent force-resolving all questions.
        // Questions should be resolved individually via the resolution process.
        await predictionQueue.add('calculate-points', { matchId: matchId });
        console.log(`[Queue] Added 'calculate-points' job to queue for matchId: ${matchId}`);

        return {
            message: 'Question Resolution Process Finalized for Match. Points calculation started in the background.',
            status: updatedMatchStatus.status
        }
    }


    if (updatedMatchStatus.status === 4) {
        await prisma.question.updateMany({
            where: {
                matchId: matchId,
                questionStatus: 3
            },
            data: {
                questionStatus: 4
            }
        })
        return {
            message: 'Match Points Calculated',
            status: updatedMatchStatus.status
        }
    }


}

export const getMatchStatus = async (matchId: number) => {
    const match = await prisma.match.findUnique({
        where: {
            matchId: matchId
        },
        include: {
            questions: true
        }
    })


    if (!match) {
        throw new BadRequestError('Match not found')
    }
    return match.status

}