// zod validation for environment variables
import { config } from 'dotenv'
import { flattenError, z } from 'zod'

config()

const envSchema = z.object({  
  PORT: z.string().default('3000').transform(Number),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {  // if the environment variables are not valid, exit the process
  console.error('Invalid environment variables:')
  console.error(flattenError(parsed.error).fieldErrors)
  process.exit(1)
}

export const env = parsed.data  // export the validated environment variables

