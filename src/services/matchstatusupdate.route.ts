import type { FastifyInstance } from 'fastify'
import { updateMatchStatus, getMatchStatus } from './matchstatusupdate.service.ts'
import { BadRequestError } from '../errors/HttpError.ts'


export default async function matchstatusupdateRoutes(app: FastifyInstance) {
    app.put('/match/status/:matchId', {
        schema: {
            description: 'Update the status of a match',
            tags: ['matchstatusupdate'],
            params: {
                type: 'object', 
                properties: {
                    matchId: { type: 'number' }
                },
                required: ['matchId']
            },
            body: {   
                type: 'object',
                properties: {
                    status: { type: 'number' }
                },
                required: ['status']
            },
            reponse: {
                200: {
                    description: 'Match status updated successfully',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        status: { type: 'number' }
                    }
                }
            }
        },
    },
    async (request, reply) => {

       const  matchId = Number((request.params as { matchId: string }).matchId)

       const status = Number((request.body as { status: string }).status)

       const result = await updateMatchStatus(matchId, status)
       return reply.send({data: result })
    })


    app.get('/match/status/:matchId', {
        schema: {
            description: 'Get the status of a match',
            tags: ['matchstatusupdate'],
            params: {
                type: 'object',
                properties: {
                    matchId: { type: 'number' }
                },
                required: ['matchId']
            },
            response: {
                200: {
                    description: 'Match status retrieved successfully',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        status: { type: 'number' }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const matchId = Number((request.params as { matchId: string }).matchId)
        const result = await getMatchStatus(matchId)
        return reply.status(200).send({data: result })
    })
}