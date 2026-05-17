import type { PrismaClient } from '../../generated/prisma/client.ts'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }

  interface FastifyRequest {
    user: {
      id: string;
      username: string;
    };
  }

}
