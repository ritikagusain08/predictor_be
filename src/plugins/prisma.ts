import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../config/prisma.ts'

async function prismaPlugin(app: FastifyInstance) {
  app.decorate('prisma', prisma)
}

export default fp(prismaPlugin, { name: 'prisma' })
