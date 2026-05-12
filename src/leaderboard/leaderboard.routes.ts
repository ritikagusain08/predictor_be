import type { FastifyInstance } from 'fastify'
import { getMatchLeaderboard,getUserMatchLeaderboard, getUserSeasonLeaderboard, getSeasonLeaderboard, getLeagueMatchwiseLeaderboard, getLeagueSeasonLeaderboard } from './leaderboard.service.ts'
import { authenticate } from '../hooks/authenticate.ts'


export const leaderboardRoutes = async (app: FastifyInstance) => {
    app.get('/:matchId/match-leaderboard',{
        preHandler: [authenticate],
        schema: {
           description: 'Get match leaderboard',
           tags: ['leaderboard'],
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
        const result = await getMatchLeaderboard(request)
        return reply.status(200).send(result)
    })

    app.get('/:matchId/match-leaderboard-user',{
         preHandler: [authenticate],
        schema: {
           description: 'Get user match leaderboard',
           tags: ['leaderboard'],
           security: [{ bearerAuth: [] }],
           params: {
            type: 'object',
            properties: {
                matchId: { type: 'number' }
            },
            required: ['matchId']
           }
        }
    }, async (request, reply) => {
        const result = await getUserMatchLeaderboard(request)
        return reply.status(200).send(result)
    })

    app.get('/season-leaderboard', {
        preHandler: [authenticate],
        schema: {
           description: 'Get season leaderboard',
           tags: ['leaderboard'],
           security: [{ bearerAuth: [] }]
        }
    },async (request, reply) => {
        const result = await getSeasonLeaderboard(request)
        return reply.status(200).send(result)
    })

    app.get('/user-season-leaderboard', {
        preHandler: [authenticate],
        schema: {
           description: 'Get user season leaderboard',
           tags: ['leaderboard'],
           security: [{ bearerAuth: [] }]
        }
    },async (request, reply) => {
        const result = await getUserSeasonLeaderboard(request)
        return reply.status(200).send(result)
    })
// /*
    // --------------------GET LEAGUE MATCHWISE LEADERBOARD--------------------
    app.get('/league/:leagueId/:matchId', {
        preHandler: [authenticate],
        schema: {
            description: 'Get matchwise league leaderboard',
            tags: ['leaderboard'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    leagueId: { type: 'number' },
                    matchId: { type: 'number' }
                },
                required: ['leagueId', 'matchId']
            }
        }
    }, async (request, reply) => {
        const result = await getLeagueMatchwiseLeaderboard(request)
        return reply.status(200).send(result)
    })

    // --------------------GET LEAGUE SEASON LEADERBOARD--------------------
    app.get('/league/season-leaderboard/:leagueId', {
        preHandler: [authenticate],
        schema: {
            description: 'Get season league leaderboard',
            tags: ['leaderboard'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    leagueId: { type: 'number' }
                },
                required: ['leagueId']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    leagueId: { type: 'number' },
                                    points: { type: 'number' },
                                    rank: { type: 'number' },
                                    prvPoints: { type: 'number' },
                                    prvRank: { type: 'number' },
                                    trend: { type: 'string' },
                                    user: {
                                        type: 'object',
                                        properties: {
                                            username: { type: 'string' }
                                        }
                                    },
                                    league: {
                                        type: 'object',
                                        properties: {
                                            leagueName: { type: 'string' },
                                            templateId: { type: 'number' },
                                            }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const result = await getLeagueSeasonLeaderboard(request)
        return reply.status(200).send(result)
    })
}