
// authentication middleware (JWT guard)
import type { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedError } from '../errors/HttpError.js'

export async function authenticate(    // middleware function. runs before your route handler
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify()  //Reads token from header. Verifies it using secret
                // If valid → attaches user to request
  } catch {  // If invalid, throw an error
    throw new UnauthorizedError('Missing or invalid token')
  }
}