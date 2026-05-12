import type { FastifyInstance } from "fastify"
import { authenticate } from "../hooks/authenticate.ts"
import { createUserLeague, disjoinLeague, getLeagueInfo, updateUserLeague, joinUserLeague, joinLeagueByCode, getUnjoinedLeagues, removeMember, getAllLeagues, deleteLeague } from "./league.service.ts"
import type { CreateLeagueSchemaType, UpdateLeagueSchemaType, JoinLeagueSchemaType, JoinLeagueByCodeSchemaType } from "./league.schema.ts"

export default async function leagueRoutes(app: FastifyInstance) {
    app.addHook('preHandler', authenticate)

    app.post("/createLeague", {
        schema: {
            tags: ['league'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    leagueName: { type: 'string' },
                    templateId: { type: 'number' },
                    maximumMembers: { type: 'number' }
                },
                required: ['leagueName', 'templateId']
            },
            response: {
                201: {
                    description: 'League created successfully',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                leagueName: { type: 'string' },
                                leagueCode: { type: 'string' },
                                templateId: { type: 'number' },
                                userId: { type: 'string' },
                                createdAtMatchId: { type: 'number' },
                                maximumMembers: { type: 'number' }
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        const result = await createUserLeague(req)
        reply.status(201).send(result)
    })

    app.post("/joinLeague", {
        schema: {
             tags: ['league'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    leagueId: { type: 'number' }
                },
                required: ['leagueId']
            },
            response: {
                201: {
                    description: 'League joined successfully',
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
                                joinedAtMatchId: { type: 'number' },
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        const result = await joinUserLeague(req)
        reply.status(201).send(result)
    })

    app.post("/joinLeagueByCode", {
        schema: {
             tags: ['league'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    leagueCode: { type: 'string' }
                },
                required: ['leagueCode']
            },
            response: {
                201: {
                    description: 'League joined successfully',
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
                                joinedAtMatchId: { type: 'number' },
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        const result = await joinLeagueByCode(req)
        reply.status(201).send(result)
    })

    app.get("/unjoinedLeagues", {
        schema: {
             tags: ['league'],
            security: [{ bearerAuth: [] }],
            response: {
                201: {
                    description: 'Unjoined leagues fetched successfully',
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
                                    membersCount: { type: 'number' },
                                    template: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string' },
                                        }
                                    },
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        const result = await getUnjoinedLeagues(req)
        reply.status(201).send(result)
    })

    app.put("/disjoinLeague", {
        schema: {
             tags: ['league'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    leagueId: { type: 'number' }
                },
                required: ['leagueId']
            },
            response: {
                201: {
                    description: 'League disjoined successfully',
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
                                joinedAtMatchId: { type: 'number' },
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        const result = await disjoinLeague(req)
        reply.status(201).send(result)
    })

    app.put("/updateLeague", {
        schema: {
             tags: ['league'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    leagueName: { type: 'string' }
                },
                required: ['id', 'leagueName']
            },
            response: {
                201: {
                    description: 'League updated successfully',
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
                                joinedAtMatchId: { type: 'number' },
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        const result = await updateUserLeague(req)
        reply.status(201).send(result)
    })

    app.get("/allLeagues", {
        schema: {
             tags: ['league'],
            security: [{ bearerAuth: [] }],
            response: {
                201: {
                    description: 'All leagues fetched successfully',
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
                                    membersCount: { type: 'number' },
                                    template: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string' },
                                        }
                                    },
                                    user:{
                                        type: 'object',
                                        properties: {
                                            username: { type: 'string' },
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
        const result = await getAllLeagues(req)
        reply.status(201).send(result)
    })

    app.get("/getLeagueInfo", {
        schema: {
             tags: ['league'],
            security: [{ bearerAuth: [] }],
            query: {
                type: 'object',
                properties: {
                    leagueId: { type: 'number' }
                },
                required: ['leagueId']
            },
            response: {
                201: {
                    description: 'League fetched successfully',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                leagueName: { type: 'string' },
                                templateId: { type: 'number' },
                                membersCount: { type: 'number' },
                                template: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                    }
                                },
                                members: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'number' },
                                            leagueId: { type: 'number' },
                                            userId: { type: 'string' },
                                            joinedAtMatchId: { type: 'number' },
                                            isAdmin: { type: 'boolean' },
                                            user: {
                                                type: 'object',
                                                properties: {
                                                    username: { type: 'string' },
                                                }
                                            }
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
        const result = await getLeagueInfo(req)
        reply.status(201).send(result)
    })

    app.post("/deleteLeague", {
        schema: {
             tags: ['league'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    leagueId: { type: 'number' }
                },
                required: ['leagueId']
            },
            response: {
                201: {
                    description: 'League deleted successfully',
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
                                joinedAtMatchId: { type: 'number' },
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        const result = await deleteLeague(req)
        reply.status(201).send(result)
    })

    app.post("/removeMember", {
        schema: {
             tags: ['league'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    leagueId: { type: 'number' },
                    memberId: { type: 'string' }
                },
                required: ['leagueId', 'memberId']
            },
            response: {
                201: {
                    description: 'Member removed successfully',
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
                                joinedAtMatchId: { type: 'number' },
                            }
                        }
                    }
                }
            }
        }
    }, async (req, reply) => {
        const result = await removeMember(req)
        reply.status(201).send(result)
    })
}