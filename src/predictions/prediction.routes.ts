import type { FastifyInstance } from 'fastify'
import { createPrediction, getPrediction, getUserMatchPredictions } from './prediction.service.ts'
import { authenticate } from '../hooks/authenticate.ts'

export default async function predictionRoutes(app: FastifyInstance) {
    app.post('/create', {
        preHandler: [authenticate],
        schema: {
            description: 'Create a new prediction',
            tags: ['predictions'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    matchId: { type: 'number' },
                    questionId: { type: 'number' },
                    hasBooster: { type: 'boolean' },
                    answers: { type: 'array', items: { type: 'object', properties: { optionId: { type: 'number' }, position: { type: 'number' } } } }
                },
                required: ['matchId', 'questionId', 'answers', 'hasBooster']
            },
            response: {
                201: {
                    description: 'Prediction created successfully',
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        userId: { type: 'string' },
                        matchId: { type: 'number' },
                        questionId: { type: 'number' },
                        hasBooster: { type: 'boolean' },
                        answers: { type: 'array', items: { type: 'object', properties: { optionId: { type: 'number' }, position: { type: 'number' } } } }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const prediction = await createPrediction(request)
        return reply.status(201).send(prediction)
    })


    app.get('/get/:matchId/:questionId', {
        preHandler: [authenticate],
        schema: {
            description: 'Get a prediction',
            tags: ['predictions'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    matchId: { type: 'number' },
                    questionId: { type: 'number' }
                },
                required: ['matchId', 'questionId']
            }
        }
    },
    async (request, reply) => {
        const prediction = await getPrediction(request)
        return reply.status(200).send(prediction)
    })


    app.get('/get/:matchId', {
        preHandler: [authenticate],
        schema: {
            description: 'Get a prediction',
            tags: ['predictions'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    matchId: { type: 'number' }
                },
                required: ['matchId']
            }
        }
    },
    async (request, reply) => {
        const result = await getUserMatchPredictions(request)
        return reply.status(200).send(result)
    })
}