import { z } from 'zod'

export const RegisterSchema = z.object({
    email: z.email('Invalid email address'),
    username: z.string().min(5, 'Username is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long')
})

export const LoginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long')
})


export type RegisterSchemaType = z.infer<typeof RegisterSchema>
export type LoginSchemaType = z.infer<typeof LoginSchema>