import { prisma } from '../config/prisma.ts'
import type { FastifyRequest } from "fastify"
import type { CreatePredictionSchemaType } from "./prediction.schema.ts"
import { BadRequestError } from '../errors/HttpError.ts'

export const createPrediction = async (req: FastifyRequest) => {
    const data = req.body as CreatePredictionSchemaType
    const userId = req.user.id
    const { questionId, matchId, answers } = data

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!existingUser) {
        throw new BadRequestError('User not found')
    }

    const existingQuestion = await prisma.question.findUnique({
        where: {
            id: questionId
        }
    })
    if (!existingQuestion) {
        throw new BadRequestError('Question not found')
    }

    const existingMatch = await prisma.match.findUnique({
        where: {
            matchId: matchId
        }
    })
    if (!existingMatch) {
        throw new BadRequestError('Match not found')
    }


    // check if match status is open 

    if (existingMatch.status !== 1) {
        throw new BadRequestError('Gameday is not open')
    }

    // one booster per match logic
    if (data.hasBooster) {
        await prisma.prediction.updateMany({
            where: {
                userId: userId,
                matchId: matchId,
                NOT: {
                    questionId: questionId
                }
            },
            data: {
                hasBooster: false
            }
        })
    }

    const existingPrediction = await prisma.prediction.findUnique({
        where: {
            userId_matchId_questionId: {
                userId: userId,
                matchId: matchId,
                questionId: questionId
            }
        }
    })

    if (existingPrediction) {
        const updatedPrediction = await prisma.prediction.update({
            where: {
                userId_matchId_questionId: {
                    userId: userId,
                    matchId: matchId,
                    questionId: questionId
                }
            },
            data: {
                hasBooster: data.hasBooster,
                points: 0,
                answers: {
                    deleteMany: {}, // This is required to clear old answers before adding new ones
                    create: answers.map(answer => ({
                        optionId: answer.optionId,
                        questionId: questionId,
                        position: answer.position,
                    }))
                }
            },
            include: {
                answers: true
            }
        })
        return updatedPrediction
    }

    const prediction = await prisma.prediction.create({
        data: {
            userId: userId,
            questionId: questionId,
            matchId: matchId,
            hasBooster: data.hasBooster,
            points: 0,
            answers: {
                create: answers.map(answer => ({
                    optionId: answer.optionId,
                    questionId: questionId,
                    position: answer.position
                }))
            }
        },
        include: {
            answers: true
        }
    })
    return prediction

}

export const getPrediction = async (req: FastifyRequest) => {
    const { matchId, questionId } = req.params as { matchId: string, questionId: string }
    const userId = req.user.id
    const prediction = await prisma.prediction.findUnique({
        where: {
            userId_matchId_questionId: {
                userId: userId,
                matchId: Number(matchId),
                questionId: Number(questionId)
            }
        },
        include: {
            answers: true
        }
    })
    return prediction
}


export const getUserMatchPredictions = async (req: FastifyRequest) => {
    const { matchId } = req.params as { matchId: string }
    const userId = req.user.id
    const predictions = await prisma.prediction.findMany({
        where: {
            userId: userId,
            matchId: Number(matchId)
        },
        orderBy: {
            questionId: 'asc'
        },
        include: {
            match: true,
            question: true,
            answers: true
        }
    })

    const is_predicted = predictions.length > 0 ? 1 : 0;
    return {
        is_predicted,
        predictions
    }
}
