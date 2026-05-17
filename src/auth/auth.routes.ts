import type { FastifyInstance } from "fastify"
import { registerUser, loginUser } from "./auth.service.ts"
import { RegisterSchema, LoginSchema } from "./auth.schema.ts"
import { BadRequestError } from "../errors/HttpError.ts"
// import { authenticate } from "../hooks/authenticate.ts"

export default async function authRoutes(app: FastifyInstance) {
    app.post('/register', {
        schema: {
           description: 'Register a new user',
           tags: ['auth'],
           body: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    format: 'email',
                },
                username: {
                    type: 'string',
                    description: 'The username of the user'
                },
                password: {
                    type: 'string',
                    description: 'The password of the user'
                }
            },
           },
           response: {   
            201: {
                description: 'User registered successfully',
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    username: { type: 'string' },
                    token: { type: 'string' }
                    }
                }
            },
        },
    },
    async (request, reply) => {   // handler function
        // Validate with Zod (runtime check)
    const result = RegisterSchema.safeParse(request.body)   //checks if input is valid

    if (!result.success) {
    throw new BadRequestError('Invalid request body', result.error.toString())
    }

    const user = await registerUser(result.data)
    const token = await request.server.jwt.sign({ id: user.id, username: user.username })

    return reply.status(201).send({token, userId: user.id, username: user.username })
})

app.post('/login', {
    // preHandler: [authenticate],
    schema: {
        description: 'Login a user',
        tags: ['auth'],
        // security: [{ bearerAuth: [] }],
        body:{
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    format: 'email',
                },
                password: {
                    type: 'string',
                }
            },
            required: ['email', 'password']
        },
        response: {
            200: {
                description: 'User logged in successfully',
                type: 'object',
                properties: {
                    token: { type: 'string' },
                    userId: { type: 'string' },
                    username: { type: 'string' }
                    }
                }
            }
        },
    },
    async (request, reply) => {
        const result = LoginSchema.safeParse(request.body)
        if (!result.success) {
            throw new BadRequestError('Invalid request body', result.error.toString())
        }
        const user = await loginUser(result.data)

        const token = await request.server.jwt.sign({ id: user.id, username: user.username })

        return reply.status(200).send({token, userId: user.id, username: user.username })
    })
}


        