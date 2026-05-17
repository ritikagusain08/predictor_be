import { prisma } from '../config/prisma.ts'
import type { CreateQuestionSchemaType, UpdateQuestionSchemaType, ResolveQuestionSchemaType } from './question.schema.ts'
import { BadRequestError } from '../errors/HttpError.ts'
import { updateMatchStatus } from '../services/matchstatusupdate.service.ts'

export const createQuestion = async (data: CreateQuestionSchemaType) => {
    console.log('DEBUG createQuestion received payload:', JSON.stringify(data, null, 2));
    const { questionNo, questionDescription, questionType, choiceLimit, questionStatus, matchId, options } = data

    if (!matchId || matchId === 0 || matchId < 1000) {
        throw new BadRequestError(`Invalid Match ID (${matchId}) received. Please ensure a valid match (e.g., 1001) is selected in the dropdown.`);
    }

    const existingQuestion = await prisma.question.findUnique({
        where: {
            matchId_questionNo:{    // unique constraint using composite key 
                           // constraint name is matchId_questionNo
                matchId: matchId,
                questionNo: questionNo
            }
        }
    })

    if (existingQuestion) {
        throw new BadRequestError('Question already exists')
    }

    const question = await prisma.question.create({
        data: {
            questionNo: questionNo,
            questionDescription: questionDescription,
            questionType: questionType.toString(),
            choiceLimit: choiceLimit,
            questionStatus: questionStatus,
            matchId: matchId,
            options: {
                create: options.map(option => ({
                    optionId: option.optionId,
                    optionDesc: option.optionDesc,
                    points: option.points,
                    position: option.position,
                    isCorrect: option.isCorrect
                }))
            }
        },
        include: {
            options: true
        }
    })
    return question
}


export const getQuestions = async () => {
    const questions = await prisma.question.findMany({
        include: {
            options: true
        }
    })
    return questions
}



export const getMatchQuestion = async (matchId: number) => {
    const question = await prisma.question.findMany({
        where: {
            matchId: matchId
        },
        select: {
            id: true,
            questionNo: true,
            questionDescription: true,
            questionType: true,
            choiceLimit: true,
            questionStatus: true,
            options: {
                select: {
                    id: true,
                    optionId: true,
                    optionDesc: true,
                    points: true,
                    position: true,
                    isCorrect: true
                }
            }
        }
    })
    return question
}


export const getQuestion = async (matchId: number, questionNo: number) => {
    const question = await prisma.question.findUnique({
        where: {
            matchId_questionNo: {
                matchId: matchId,
                questionNo: questionNo
            }
        },
        include: {
            options: true
        }
    })
    return question
}


export const updateQuestion = async (data: UpdateQuestionSchemaType) => {
    const { questionId, questionNo, questionDescription, questionType, choiceLimit, questionStatus, options } = data

    const existingQuestion = await prisma.question.findUnique({
        where: {
            id: questionId
            }
    })

    if (!existingQuestion) {
        throw new BadRequestError('Question not found')
    }

    const updatedQuestion = await prisma.question.update({
        where: {
            id: questionId
        },
        data: {
            ...(questionNo !== undefined && { questionNo: questionNo }),
            ...(questionDescription !== undefined && { questionDescription: questionDescription }),
            ...(questionType !== undefined && { questionType: questionType }),
            ...(choiceLimit !== undefined && { choiceLimit: choiceLimit }),
            ...(questionStatus !== undefined && { questionStatus: questionStatus }),
            options: {
                deleteMany: {},
                create: options.map(option => ({
                    optionId: option.optionId,
                    optionDesc: option.optionDesc,
                    points: option.points,
                    position: option.position,
                    isCorrect: option.isCorrect
                }))
            }
        },
        include: {
            options: true
        }
    })
    return updatedQuestion
}


export const deleteQuestion = async (questionId: number) => {
    const existingQuestion = await prisma.question.findUnique({
        where: {
            id: questionId
        }
    })
    if (!existingQuestion) {
        throw new BadRequestError('Question not found')
    }
    await prisma.question.delete({
        where: { id: questionId }
    })
    return { message: 'Question deleted successfully' }
}


export const resolveQuestion = async (data: ResolveQuestionSchemaType) => {
      const { questionId, options } = data

      const existingQuestion = await prisma.question.findUnique({
        where: {
            id: questionId
        },
        include: {
            options: true
        }
      })

      if (!existingQuestion) {
        throw new BadRequestError('Question not found')
      }

      const resolvedQuestion = await prisma.question.update({
        where: {
            id: questionId
        },
        data: {
            questionStatus: 3, //  Explicitly mark as Resolved
            options: {
                update: options.map(option => {
                    if (!option.optionId) {
                        throw new BadRequestError('Option ID is required')
                    }
                    return {
                        where: {
                            optionId_questionId: {
                                optionId: option.optionId,
                                questionId, // same Question `id` you already use for the parent update
                              },
                        },
                        data: {
                            ...(option.position !== undefined && { position: option.position }),
                            ...(option.isCorrect !== undefined && { isCorrect: option.isCorrect })
                        }
                    }
                })
            }
        }
      })

    //  match status update to 3
    //  await updateMatchStatus(existingQuestion.matchId, 3)

    return { message: 'Question resolved successfully', questionStatus: resolvedQuestion.questionStatus }
}

export const updateQuestionStatus = async (questionId: number, questionStatus: number) => {
    const existingQuestion = await prisma.question.findUnique({
        where: {
            id: questionId
        }
    })
    if (!existingQuestion) {
        throw new BadRequestError('Question not found')
    }
    const updatedQuestion = await prisma.question.update({
        where: {
            id: questionId
        },
        data: {
            questionStatus: questionStatus
        }
    })
    return updatedQuestion
}