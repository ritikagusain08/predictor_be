import type { FastifyInstance } from 'fastify'
import { CreateTeamSchema } from './team.schema.ts'
import { createTeam, getTeamById, getTeams } from './team.service.ts'
import { BadRequestError } from '../errors/HttpError.ts'


export default async function teamRoutes(app: FastifyInstance) {
    app.post('/create', {
        schema :{
            description: 'Create a new team',
            tags: ['teams'],
            body: {
                type: 'object',
                properties: {
                    teamId: { type: 'string' },
                    teamName: { type: 'string' },
                    teamShortName: { type: 'string' }
                },
                required: ['teamId', 'teamName', 'teamShortName']
            },
            response: {
                201: {
                    description: 'Team created successfully',
                    type: 'object',
                    properties: {
                        teamId: { type: 'string' },
                        teamName: { type: 'string' },
                        teamShortName: { type: 'string' },
                        players: { type: 'array', items: { type: 'object', properties: { playerId: { type: 'string' }, playerName: { type: 'string' }, playerSkill: { type: 'string' }, isActive: { type: 'boolean' } } } }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const result = CreateTeamSchema.safeParse(request.body)
        if (!result.success) {
            throw new BadRequestError('Invalid request body', result.error.toString())
        }
        const team = await createTeam(result.data)
        return reply.status(201).send(team)
    })

    app.get('/allteams', {
        schema: {
            description: 'Get all teams',
            tags: ['teams'],
            response: {
                200: {
                    description: 'Teams found',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            teamId: { type: 'string' },
                            teamName: { type: 'string' },
                            teamShortName: { type: 'string' },
                            players: { type: 'array', items: { type: 'object', properties: { playerId: { type: 'string' }, playerName: { type: 'string' }, playerSkill: { type: 'string' }, isActive: { type: 'boolean' } } } }
                        }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const teams = await getTeams()
        return reply.status(200).send(teams)
    })

    app.get('/:teamId', {
        schema: {
            description: 'Get a team by ID',
            tags: ['teams'],
            response: {
                200: {
                    description: 'Team found',
                    type: 'object',
                    properties: {
                        teamId: { type: 'string' },
                        teamName: { type: 'string' },
                        teamShortName: { type: 'string' },
                        players: { type: 'array', items: { type: 'object', properties: { playerId: { type: 'string' }, playerName: { type: 'string' }, playerSkill: { type: 'string' }, isActive: { type: 'boolean' } } } }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const { teamId } = request.params as { teamId: string }
        const team = await getTeamById(teamId)
        return reply.status(200).send(team)
    })
}

