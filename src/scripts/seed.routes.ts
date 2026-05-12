import type { FastifyInstance } from 'fastify'
import { seedF1DataService } from './seed.service.ts'
import { BadRequestError } from '../errors/HttpError.ts'

export default async function seedRoutes(app: FastifyInstance) {
    app.post('/seed/f1', {
        schema: {
            description: 'Seed the F1 data',
            tags: ['Seed'],
            response: {
                200: {
                    description: 'F1 data seeded successfully',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }                  
        }
    },
    async (request, reply) => {
       try {
         const result = await seedF1DataService()
         return reply.status(200).send({ message: 'F1 data seeded successfully', result })
       } catch (error: any) {
        throw new BadRequestError('Failed to seed F1 data', error.message)
       }
    })
}