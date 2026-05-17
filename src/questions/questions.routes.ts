import type { FastifyInstance } from 'fastify'
import { createQuestion, getQuestions, getQuestion,getMatchQuestion, updateQuestion, deleteQuestion, resolveQuestion,updateQuestionStatus  } from './question.service.ts'
import { CreateQuestionSchema, UpdateQuestionSchema,   ResolveQuestionSchema } from './question.schema.ts'
import { BadRequestError } from '../errors/HttpError.ts'

export const questionsRoutes = async (app: FastifyInstance) => {
    app.post('/create', {
        schema: {
            description: 'Create a new question',
            tags: ['questions'],
            body: {
                type: 'object',
                properties: {
                    questionNo: { type: 'number' },
                    questionDescription: { type: 'string' },
                    questionType: { type: 'string' },
                    choiceLimit: { type: 'number' },
                    questionStatus: { type: 'number' },
                    matchId: { type: 'number' },
                    options: { type: 'array', items: { type: 'object', properties: { optionId: { type: 'number' }, optionDesc: { type: 'string' }, points: { type: 'number' }, position: { type: 'number' }, isCorrect: { type: 'boolean' } } } }
                },
                required: ['questionNo', 'questionDescription', 'questionType', 'choiceLimit', 'questionStatus', 'matchId', 'options']
            },
            response: {
                201: {
                    description: 'Question created successfully',
                    type: 'object',
                    properties: { questionNo: { type: 'number' }, questionDescription: { type: 'string' }, questionType: { type: 'string' }, choiceLimit: { type: 'number' }, questionStatus: { type: 'number' }, matchId: { type: 'number' }, options: { type: 'array', items: { type: 'object', properties: { optionId: { type: 'number' }, optionDesc: { type: 'string' }, points: { type: 'number' }, position: { type: 'number' }, isCorrect: { type: 'boolean' } } } } }
                }
            }
        }
    },
    async (request, reply) => {
        const result = CreateQuestionSchema.safeParse(request.body)
        if (!result.success) {
            throw new BadRequestError('Invalid request body', result.error.toString())
        }
        const question = await createQuestion(result.data)
        return reply.status(201).send(question)
    })

    app.get('/allquestions', {
        schema: {
            description: 'Get all questions',
            tags: ['questions'],
            response: {
                200: {
                    description: 'Questions found',
                    type: 'array',
                    items: { type: 'object', properties: { questionNo: { type: 'number' }, questionDescription: { type: 'string' }, questionType: { type: 'string' }, choiceLimit: { type: 'number' }, questionStatus: { type: 'number' }, matchId: { type: 'number' }, options: { type: 'array', items: { type: 'object', properties: { optionId: { type: 'number' }, optionDesc: { type: 'string' }, points: { type: 'number' }, position: { type: 'number' }, isCorrect: { type: 'boolean' } } } } } }
                }
            }
        }
    },
    async (request, reply) => {
        const questions = await getQuestions()
        return reply.status(200).send(questions)
    })


    app.get('/:matchId/:questionId', {
        schema: {
            description: 'Get a question by ID',
            tags: ['questions'],
            params: {
                type: 'object',
                properties: {
                    questionId: { type: 'number' },
                    matchId: { type: 'number' }
                },
                required: ['questionId', 'matchId']
            },
            response: {
                200: {
                    description: 'Question found',
                    type: 'object',
                    properties: { questionNo: { type: 'number' }, questionDescription: { type: 'string' }, questionType: { type: 'string' }, choiceLimit: { type: 'number' }, questionStatus: { type: 'number' }, matchId: { type: 'number' }, options: { type: 'array', items: { type: 'object', properties: { optionId: { type: 'number' }, optionDesc: { type: 'string' }, points: { type: 'number' }, position: { type: 'number' }, isCorrect: { type: 'boolean' } } } } } }
                }
            }
        },
        async (request, reply) => {
            
            const { questionId, matchId } = request.params as { questionId: string, matchId: string }
            const question = await getQuestion(Number(matchId), Number(questionId))
            return reply.status(200).send(question)
        })


        
    app.get('/:matchId', {
        schema: {
            description: 'Get a question by ID',
            tags: ['questions'],
            params: {
                type: 'object',
                properties: {
                    matchId: { type: 'number' }
                },
                required: ['matchId']
            },
            response: {
                200: {
                    description: 'Questions found',
                    type: 'array',
                    items: { type: 'object', properties: { id: { type: 'number' }, questionNo: { type: 'number' }, questionDescription: { type: 'string' }, questionType: { type: 'string' }, choiceLimit: { type: 'number' }, questionStatus: { type: 'number' }, matchId: { type: 'number' }, options: { type: 'array', items: { type: 'object', properties: { optionId: { type: 'number' }, optionDesc: { type: 'string' }, points: { type: 'number' }, position: { type: 'number' }, isCorrect: { type: 'boolean' } } } } } }
                }
            }
        },
    },
        async (request, reply) => {
            const { matchId } = request.params as { matchId: string }
            const questions = await getMatchQuestion(Number(matchId))
            return reply.status(200).send(questions)
        })

    app.put('/:questionId', {
        schema: {
            description: 'Update a question',
            tags: ['questions'],
            params: {
                type: 'object',
                properties: {
                    questionId: { type: 'number' }
                },
                required: ['questionId']
            },
            body: {
                type: 'object',
                properties: {
                    questionNo: { type: 'number' },
                    questionDescription: { type: 'string' },
                    questionType: { type: 'string' },
                    choiceLimit: { type: 'number' },
                    questionStatus: { type: 'number' },
                    matchId: { type: 'number' },
                    options: { type: 'array', items: { type: 'object', properties: { optionId: { type: 'number' }, optionDesc: { type: 'string' }, points: { type: 'number' }, position: { type: 'number' }, isCorrect: { type: 'boolean' } } } }
                },
                required: ['questionNo', 'questionDescription', 'questionType', 'choiceLimit', 'questionStatus', 'matchId', 'options']
            },
            response: {
                200: {
                    description: 'Question updated successfully',
                    type: 'object',
                    properties: { questionNo: { type: 'number' }, questionDescription: { type: 'string' }, questionType: { type: 'string' }, choiceLimit: { type: 'number' }, questionStatus: { type: 'number' }, matchId: { type: 'number' }, options: { type: 'array', items: { type: 'object', properties: { optionId: { type: 'number' }, optionDesc: { type: 'string' }, points: { type: 'number' }, position: { type: 'number' }, isCorrect: { type: 'boolean' } } } } } }
                }
            }
        },
    async (request, reply) => {
       
        const result = UpdateQuestionSchema.safeParse(request.body)
        if (!result.success) {
            throw new BadRequestError('Invalid request body', result.error.toString())
        }

        const params = request.params as { questionId: string } 

        const { questionId } = params
       const question = await updateQuestion({ ...result.data, questionId: Number(questionId) })
        return reply.status(200).send(question)
    })

    app.delete('/:questionId', {
        schema: {
            description: 'Delete a question',
            tags: ['questions'],
            params: {
                type: 'object',
                properties: {
                    questionId: { type: 'number' }
                },
                required: ['questionId']
            },
            response: {
                200: {
                    description: 'Question deleted successfully',
                    type: 'object',
                    properties: { questionId: { type: 'string' }, message: { type: 'string' } }  
                }
            }
    }
        },
        async (request, reply) => {
            const { questionId } = request.params as { questionId: string }
            await deleteQuestion(Number(questionId))
            return reply.status(200).send({ message: 'Question deleted successfully' })
        })


    app.put('/resolve/:questionId', {
        schema: {
            description: 'Resolve a question',
            tags: ['questions'],
            params: {
                type: 'object',
                properties: {
                    questionId: { type: 'number' }
                },
                required: ['questionId']
            },
            body: {
                type: 'object',
                properties: {
                    questionId: { type: 'number' },
                    options: { type: 'array', items: { type: 'object', properties: { optionId: { type: 'number' }, position: { type: 'number' }, isCorrect: { type: 'boolean' } } } }
                },
                required: ['questionId', 'options']
            },
            response: {
                200: {
                    description: 'Question resolved successfully',
                    type: 'object',
                    properties: { message: { type: 'string' } }
                }
            }
        }
    },
    async (request, reply) => {
      
        const result = ResolveQuestionSchema.safeParse(request.body)
        if (!result.success) {
            throw new BadRequestError('Invalid request body', result.error.toString())
        }
        const { questionId } = request.params as { questionId: string }
        await resolveQuestion({ ...result.data, questionId: Number(questionId) })
        return reply.status(200).send({ message: 'Question resolved successfully' })
    })

     // src/questions/questions.routes.ts

app.put('/:questionId/status', {
    schema: {
        description: 'Update a question status',
        tags: ['questions'],
        params: {
            type: 'object',
            properties: {
                questionId: { type: 'number' } 
            },
            required: ['questionId']
        },
        body: {
            type: 'object',
            properties: {
                questionStatus: { type: 'number' }
            },
            required: ['questionStatus']
        },
        response: {
            200: {
                description: 'Question status updated successfully',
                type: 'object',
                properties: { 
                    id: { type: 'number' },
                    questionStatus: { type: 'number' } 
                }
            }
        }
    }
},
async (request, reply) => {
    const { questionId } = request.params as { questionId: number }; 
    const { questionStatus } = request.body as { questionStatus: number };
    
    try {
        const updatedQuestion = await updateQuestionStatus(questionId, questionStatus);
        return reply.status(200).send(updatedQuestion);
    } catch (error: any) {
        request.log.error(error); 
        return reply.status(error.statusCode || 500).send({ message: error.message });
    }
});



}