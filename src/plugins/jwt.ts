
// Registers JWT in Fastify and defines what data your token will contain

import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import type { FastifyInstance } from 'fastify'
import { env } from '../config/env.js'

declare module '@fastify/jwt' {   
  interface FastifyJWT {
    payload: { id: string; username: string }  // what you put inside token
    user:    { id: string; username: string }  // what you get after verify
  }
}

async function jwtPlugin(app: FastifyInstance) { // function to register the JWT plugin
  await app.register(fastifyJwt, {     // register the JWT plugin
    secret: env.JWT_SECRET,    // secret key to sign the token
    sign: {
      expiresIn: '7d',  // token expires in 7 days
    },  
  })  
}

export default fp(jwtPlugin)  // export the JWT plugin