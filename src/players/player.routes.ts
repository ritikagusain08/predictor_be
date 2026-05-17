import type { FastifyInstance } from 'fastify'
import { CreatePlayerSchema } from './player.schema.ts'
import { createPlayer, getPlayerById, getPlayers } from './player.service.ts'
import { BadRequestError } from '../errors/HttpError.ts'

export default async function playerRoutes(app: FastifyInstance) {
    app.post('/create', {
        schema: {
            description: 'Create a new player',
            tags: ['players'],
            body: {
                type: 'object',
                properties: {
                    playerId: { type: 'string' },
                    playerName: { type: 'string' },
                    playerSkill: { type: 'string' },
                    isActive: { type: 'boolean' },
                    teamId: { type: 'string' }
                },
                required: ['playerId', 'playerName', 'playerSkill', 'isActive', 'teamId']
            },
            response: {
                201: {
                    description: 'Player created successfully',
                    type: 'object',
                    properties: {
                        playerId: { type: 'string' },
                        playerName: { type: 'string' },
                        playerSkill: { type: 'string' },
                        isActive: { type: 'boolean' },
                        team: { type: 'object', properties: { teamId: { type: 'string' }, teamName: { type: 'string' }, teamShortName: { type: 'string' } } }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const result = CreatePlayerSchema.safeParse(request.body)
        if (!result.success) {
            throw new BadRequestError('Invalid request body', result.error.toString())
        }
        const player = await createPlayer(result.data)
        return reply.status(201).send(player)
    })

    app.get('/:playerId', {
        schema: {
            description: 'Get a player by ID',
            tags: ['players'],
            params: {
                type: 'object',
                properties: {
                    playerId: { type: 'string' }
                },
                required: ['playerId']
            },
            response: {
                200: {
                    description: 'Player found',
                    type: 'object',
                    properties: {
                        playerId: { type: 'string' },
                        playerName: { type: 'string' },
                        playerSkill: { type: 'string' },
                        isActive: { type: 'boolean' },
                        team: { type: 'object', properties: { teamId: { type: 'string' }, teamName: { type: 'string' }, teamShortName: { type: 'string' } } }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const { playerId } = request.params as { playerId: string }
        const player = await getPlayerById(playerId)
        return reply.status(200).send(player)
    })

    app.get('/allplayers', {
        schema: {   
            description: 'Get all players',
            tags: ['players'],
            response: {
                200: {
                    description: 'Players found',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            playerId: { type: 'string' },
                            playerName: { type: 'string' },
                            playerSkill: { type: 'string' },
                            isActive: { type: 'boolean' },
                            team: { type: 'object', properties: { teamId: { type: 'string' }, teamName: { type: 'string' }, teamShortName: { type: 'string' } } }
                        }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const players = await getPlayers()
        return reply.status(200).send(players)
    })
}