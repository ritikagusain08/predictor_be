import type { FastifyInstance } from "fastify"
import {
    createAdminLeague,
    updateAdminLeague,
    getAdminLeagues,
    deleteAdminLeague
} from "./adminLeague.service.ts"
import type { CreateAdminLeagueSchemaType, UpdateAdminLeagueSchemaType } from "./adminLeague.schema.ts"
import { BadRequestError } from "../errors/HttpError.ts"

export default async function adminLeagueRoutes(app: FastifyInstance) {
    app.post('/create', {
        schema: {
            tags: ['admin-league'],
            body: {
                type: 'object',
                properties: {
                    leagueName: { type: 'string' },
                    templateId: { type: 'number' },
                    userId: { type: 'string' },
                    createdAtMatchId: { type: 'number' },
                    startMatchId: { type: 'number' },
                    endMatchId: { type: 'number' },
                    maximumMembers: { type: 'number' }
                },
                required: ['leagueName', 'templateId', 'userId', 'createdAtMatchId', 'startMatchId', 'endMatchId', 'maximumMembers']
            },
            response: {
                201: {
                    description: 'Admin league created successfully',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                leagueName: { type: 'string' },
                                templateId: { type: 'number' },
                                userId: { type: 'string' },
                                createdAtMatchId: { type: 'number' },
                                startMatchId: { type: 'number' },
                                endMatchId: { type: 'number' },
                                maximumMembers: { type: 'number' }
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        const data = req.body as CreateAdminLeagueSchemaType
        const result = await createAdminLeague(data)
        reply.status(201).send(result)
    })


    app.get("/adminleague", {
        schema: {
            tags: ['admin-league'],
            response: {
                200: {
                    description: 'Admin league fetched successfully',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number' },
                                    leagueName: { type: 'string' },
                                    templateId: { type: 'number' },
                                    userId: { type: 'string' },
                                    createdAtMatchId: { type: 'number' },
                                    startMatchId: { type: 'number' },
                                    endMatchId: { type: 'number' },
                                    maximumMembers: { type: 'number' },
                                    template: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string' },
                                            creatorRole: { type: 'string' },
                                            allowAdminDelete: { type: 'boolean' },
                                            allowMemberRemoval: { type: 'boolean' },
                                            allowRenaming: { type: 'boolean' },
                                            allowUserLeave: { type: 'boolean' },
                                            defaultMaxMembers: { type: 'number' },
                                            hasMatchRange: { type: 'boolean' },
                                            isSearchable: { type: 'boolean' },
                                            requireLeagueCode: { type: 'boolean' }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    }, async (req, reply) => {
        const result = await getAdminLeagues()
        reply.status(200).send(result)
    })

    app.put("/update", {
        schema: {
            tags: ['admin-league'],
            body: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    leagueName: { type: 'string' },
                    templateId: { type: 'number' },
                    userId: { type: 'string' },
                    createdAtMatchId: { type: 'number' },
                    startMatchId: { type: 'number' },
                    endMatchId: { type: 'number' },
                    maximumMembers: { type: 'number' }
                },
                required: ['id', 'leagueName', 'templateId', 'userId', 'createdAtMatchId', 'startMatchId', 'endMatchId', 'maximumMembers']
            },
            response: {
                200: {
                    description: 'Admin league updated successfully',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                leagueName: { type: 'string' },
                                templateId: { type: 'number' },
                                userId: { type: 'string' },
                                createdAtMatchId: { type: 'number' },
                                startMatchId: { type: 'number' },
                                endMatchId: { type: 'number' },
                                maximumMembers: { type: 'number' }
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        const result = await updateAdminLeague(req.body as UpdateAdminLeagueSchemaType)
        reply.status(200).send(result)
    })

    app.delete("/delete", {
        schema: {
            tags: ['admin-league'],
            body: {
                type: 'object',
                properties: {
                    id: { type: 'number' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Admin league deleted successfully',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                leagueName: { type: 'string' },
                                templateId: { type: 'number' },
                                userId: { type: 'string' },
                                createdAtMatchId: { type: 'number' },
                                startMatchId: { type: 'number' },
                                endMatchId: { type: 'number' },
                                maximumMembers: { type: 'number' }
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
       const data = req.body as {id:number}
       if(!data.id){
           throw new BadRequestError('Admin league not found')
       }
       const result = await deleteAdminLeague(data.id)
       reply.status(200).send(result)
    })
}
