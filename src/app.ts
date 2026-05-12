import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swaggerPlugin from './plugins/swagger.ts';
import prismaPlugin from './plugins/prisma.ts';
import jwtPlugin from './plugins/jwt.js';
import router from './router.ts';



export async function buildApp() {
    const app = Fastify({
      logger:
        process.env.NODE_ENV === 'production'
          ? true
          : {
              transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'HH:MM:ss',
                  ignore: 'pid,hostname',
                },
              },
            },
    })

     // Security plugins
  await app.register(helmet, {    //protects your app from common attacks
    contentSecurityPolicy: false, // disable CSP so Swagger UI loads correctly 
  })
  await app.register(cors, {   //controls who can access your API
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })

  // Swagger (must be registered before routes)
  await app.register(swaggerPlugin) // register the swagger plugin
  await app.register(prismaPlugin)  // register the prisma plugin
  await app.register(jwtPlugin)  // register the JWT plugin
  await app.register(router) // register the router

  // await app.register(errorHandlerPlugin) // register the error handler plugin


app.get(
  '/users',
  {
    schema: {
      description: 'Get all users (temporary test route)',
      tags: ['Test'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id:       { type: 'string' },
              username: { type: 'string' },
              name:     { type: 'string', nullable: true },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const users = await request.server.prisma.user.findMany({
      select: {
        id:       true,
        username: true
      },
    })
    return users
  }
)

return app;
}

