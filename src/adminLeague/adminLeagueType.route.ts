import type { FastifyInstance } from 'fastify'
import { BadRequestError } from '../errors/HttpError.ts'
import { createAdminLeagueType, getAllAdminLeagueTypes, getAdminLeagueType, updateAdminLeagueType, deleteAdminLeagueType } from './adminLeagueType.service.ts'
import { createAdminLeagueTypeSchema, updateAdminLeagueTypeSchema } from './adminleagueType.schema.ts'

export const adminLeagueTypeRoutes = async (app: FastifyInstance) => {
    app.post('/create', {
        schema: {
            description: 'Create a new admin league type',
            tags: ['adminLeagueType'],
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    requireLeagueCode: { type: 'boolean' },
                    isSearchable: { type: 'boolean' },
                    allowUserLeave: { type: 'boolean' },
                    allowRenaming: { type: 'boolean' },
                    allowAdminDelete: { type: 'boolean' },
                    allowMemberRemoval: { type: 'boolean' },
                    creatorRole: { type: 'string' },
                    hasMatchRange: { type: 'boolean' },
                    defaultMaxMembers: { type: 'number' },
                    maxLeaguesPerUser: { type: 'number' },
                },
                required: ['name', 'requireLeagueCode', 'isSearchable', 'allowUserLeave', 'allowRenaming', 'allowAdminDelete', 'allowMemberRemoval', 'creatorRole', 'hasMatchRange', 'defaultMaxMembers', 'maxLeaguesPerUser']
            },
            response: {
                201: {
                    description: 'Admin league type created successfully',
                    type: 'object',
                    properties: { message: { type: 'string' }, id: { type: 'number' }, name: { type: 'string' }, requireLeagueCode: { type: 'boolean' }, isSearchable: { type: 'boolean' }, allowUserLeave: { type: 'boolean' }, allowRenaming: { type: 'boolean' }, allowAdminDelete: { type: 'boolean' }, allowMemberRemoval: { type: 'boolean' }, creatorRole: { type: 'string' }, hasMatchRange: { type: 'boolean' }, defaultMaxMembers: { type: 'number' }, maxLeaguesPerUser: { type: 'number' } }
                }
            }
        }
    },
    async (request, reply) => {
        const result = createAdminLeagueTypeSchema.safeParse(request.body)
        if (!result.success) {
            throw new BadRequestError('Invalid request body', result.error.toString())
        }
        const adminLeagueType = await createAdminLeagueType(result.data)
        return reply.status(201).send(adminLeagueType)
    })

    app.get('/alladminleaguetypes', {
        schema: {
            description: 'Get all admin league types',
            tags: ['adminLeagueType'],
            response: {
                200: {
                    description: 'Admin league types found',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number' },
                                    name: { type: 'string' },
                                    requireLeagueCode: { type: 'boolean' },
                                    isSearchable: { type: 'boolean' },
                                    allowUserLeave: { type: 'boolean' },
                                    allowRenaming: { type: 'boolean' },
                                    allowAdminDelete: { type: 'boolean' },
                                    allowMemberRemoval: { type: 'boolean' },
                                    creatorRole: { type: 'string' },
                                    hasMatchRange: { type: 'boolean' },
                                    defaultMaxMembers: { type: 'number' },
                                    maxLeaguesPerUser: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const adminLeagueTypes = await getAllAdminLeagueTypes()
        return reply.status(200).send(adminLeagueTypes)
    })

    app.get('/:adminLeagueTypeId', {
        schema: {
            description: 'Get an admin league type by ID',
            tags: ['adminLeagueType'],
            params: {
                type: 'object',
                properties: {
                    adminLeagueTypeId: { type: 'number' }
                },
                required: ['adminLeagueTypeId']
            },
            response: {
                200: {
                    description: 'Admin league type found',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                name: { type: 'string' },
                                requireLeagueCode: { type: 'boolean' },
                                isSearchable: { type: 'boolean' },
                                allowUserLeave: { type: 'boolean' },
                                allowRenaming: { type: 'boolean' },
                                allowAdminDelete: { type: 'boolean' },
                                allowMemberRemoval: { type: 'boolean' },
                                creatorRole: { type: 'string' },
                                hasMatchRange: { type: 'boolean' },
                                defaultMaxMembers: { type: 'number' },
                                maxLeaguesPerUser: { type: 'number' }
                            }
                        }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const { adminLeagueTypeId } = request.params as { adminLeagueTypeId: string }
        const adminLeagueType = await getAdminLeagueType({ id: Number(adminLeagueTypeId) })
        return reply.status(200).send(adminLeagueType)
        
    })

    app.put('/:adminLeagueTypeId', {
        schema: {
            description: 'Update an admin league type',
            tags: ['adminLeagueType'],
            params: {
                type: 'object',
                properties: {
                    adminLeagueTypeId: { type: 'number' }
                },
                required: ['adminLeagueTypeId']
            },
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    requireLeagueCode: { type: 'boolean' },
                    isSearchable: { type: 'boolean' },
                    allowUserLeave: { type: 'boolean' },
                    allowRenaming: { type: 'boolean' },
                    allowAdminDelete: { type: 'boolean' },
                    allowMemberRemoval: { type: 'boolean' },
                    creatorRole: { type: 'string' },
                    hasMatchRange: { type: 'boolean' },
                    defaultMaxMembers: { type: 'number' },
                    maxLeaguesPerUser: { type: 'number' },
                },
                required: ['name', 'requireLeagueCode', 'isSearchable', 'allowUserLeave', 'allowRenaming', 'allowAdminDelete', 'allowMemberRemoval', 'creatorRole', 'hasMatchRange', 'defaultMaxMembers', 'maxLeaguesPerUser']
            },
            response: {
                200: {
                    description: 'Admin league type updated successfully',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                name: { type: 'string' },
                                requireLeagueCode: { type: 'boolean' },
                                isSearchable: { type: 'boolean' },
                                allowUserLeave: { type: 'boolean' },
                                allowRenaming: { type: 'boolean' },
                                allowAdminDelete: { type: 'boolean' },
                                allowMemberRemoval: { type: 'boolean' },
                                creatorRole: { type: 'string' },
                                hasMatchRange: { type: 'boolean' },
                                defaultMaxMembers: { type: 'number' },
                                maxLeaguesPerUser: { type: 'number' }
                            }
                        }
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const result = updateAdminLeagueTypeSchema.safeParse(request.body)
        if (!result.success) {
            throw new BadRequestError('Invalid request body', result.error.toString())
        }
        const { adminLeagueTypeId } = request.params as { adminLeagueTypeId: string }
        const adminLeagueType = await updateAdminLeagueType({ ...result.data, id: Number(adminLeagueTypeId) })
        return reply.status(200).send(adminLeagueType)
    })

    app.delete('/:adminLeagueTypeId', {
        schema: {
            description: 'Delete an admin league type',
            tags: ['adminLeagueType'],
            params: {
                type: 'object',
                properties: {
                    adminLeagueTypeId: { type: 'number' }
                },
                required: ['adminLeagueTypeId']
            },
            response: {
                200: {
                    description: 'Admin league type deleted successfully',
                    type: 'object',
                    properties: { 
                        id: { type: 'number' }, 
                        message: { type: 'string' } 
                    }
                }
            }
        }
    },
    async (request, reply) => {
        const { adminLeagueTypeId } = request.params as { adminLeagueTypeId: string }
        const adminLeagueType = await deleteAdminLeagueType({ id: Number(adminLeagueTypeId) })
        return reply.status(200).send(adminLeagueType)
    })
}
