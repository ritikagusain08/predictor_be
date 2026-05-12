import type { FastifyInstance } from 'fastify'
import { createMatch, getMatch, getMatches } from './match.service.ts'
import { CreateMatchSchema } from './match.schema.ts'
import { BadRequestError } from '../errors/HttpError.ts'

export default async function matchRoutes(app: FastifyInstance) {
    app.post('/create', {
        schema: {
            description: 'Create a new match',
            tags: ['matches'],
            body: {
                type: 'object',
                properties: {
                    matchId: { type: 'number' },
                    gamedayId: { type: 'number' },
                    circuitLocation: { type: 'string' },    
                    circuitShortName: { type: 'string' },
                    season: { type: 'string' },
                    status: { type: 'number' }
                },
                required: ['matchId', 'gamedayId', 'circuitLocation', 'circuitShortName', 'season', 'status']
              },
            response: {
                201: {
                    description: 'Match created successfully',
                    type: 'object',
                    properties: {
                        matchId: { type: 'number' },
                        gamedayId: { type: 'number' },
                        circuitLocation: { type: 'string' },                
                        circuitShortName: { type: 'string' },
                        season: { type: 'string' },
                        status: { type: 'number' }
                    }
                }
            },
        }
    },
    async (request, reply) => {
        const result = CreateMatchSchema.safeParse(request.body)
        if (!result.success) {
            throw new BadRequestError('Invalid request body', result.error.toString())
        }
        const match = await createMatch(result.data)
        return reply.status(201).send(match)
    })

    app.get('/allmatches', {
        schema:{
            description: 'Get all matches',
            tags: ['matches'],
            response: {
                200:{
                    description: 'Matches found',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            matchId: { type: 'number' },
                            gamedayId: { type: 'number' },
                            circuitLocation: { type: 'string' },
                            circuitShortName: { type: 'string' },
                            season: { type: 'string' },
                            status: { type: 'number' }
                        }
                    }
                }   
            }
        }
    },
    async (request, reply) => {
        const matches = await getMatches()
        return reply.status(200).send(matches)
    })

    app.get('/:matchId', {
        schema: {
            description: 'Get a match by ID',
            tags: ['matches'],
            response: {
                200: {
                    description: 'Match found',
                    type: 'object',
                    properties: {
                        matchId: { type: 'number' },
                        gamedayId: { type: 'number' },
                        circuitLocation: { type: 'string' },
                        circuitShortName: { type: 'string' },
                        season: { type: 'string' },
                        status: { type: 'number' },
                    }
                    }
                }
            }
    },
    async (request, reply) => {
        const { matchId } = request.params as { matchId: string }  // {matchid} is object destructuring. We are getting the matchId from the request params.
        const match = await getMatch(Number(matchId))  // we are calling the getMatch function with the matchId
        return reply.status(200).send(match) 
    })
}

