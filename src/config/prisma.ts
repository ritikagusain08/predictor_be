import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.ts'
import { Pool } from 'pg'
import { env } from './env.ts'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pgPool: Pool | undefined
}

const pool =
  globalForPrisma.pgPool ??
  new Pool({ connectionString: env.DATABASE_URL })
if (env.NODE_ENV !== 'production') {
  globalForPrisma.pgPool = pool
}

const adapter = new PrismaPg(pool) as SqlDriverAdapterFactory

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
