import type { FastifyInstance } from 'fastify'
import { calculatePoints } from './pc.service.ts'

export default async function pcRoutes(app: FastifyInstance) {
    app.post('/pc', {
        schema: {
            description: 'Calculate points',
            tags: ['pointscalculation'],
            body: {
                type: 'object',
                properties: {
                    matchId: { type: 'number' }
                },
                required: ['matchId']
            },
            response: {
                200: {
                    description: 'Points calculated successfully',
                    type: 'object',
                    properties: { message: { type: 'string' } }
                }
            }
        }
    }, async (request, reply) => {
        const { matchId } = request.body as { matchId: number }
        const result = await calculatePoints({ matchId })
        return reply.status(200).send({ message: 'Points calculated successfully', })
    })
}
