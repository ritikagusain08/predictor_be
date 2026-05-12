// service for business logic of authentication

import { prisma } from '../config/prisma.ts'
import type { RegisterSchemaType, LoginSchemaType } from './auth.schema.ts'
import { BadRequestError } from '../errors/HttpError.ts'
import bcrypt from 'bcrypt'

export const registerUser = async( data: RegisterSchemaType ) => {
   const {email, username, password} = data

   const existingUser = await prisma.user.findUnique({
    where: {
        email: email,
        username: username
    }
   })

   if (existingUser) {
      throw new BadRequestError('User already exists')
   }

   const hashedPassword = await bcrypt.hash(password, 10)

   const user = await prisma.user.create({
    data: {
        email: email,
        username: username,
        password: hashedPassword
    },
    select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true
    }
   })

   return user
}

export const loginUser = async(data: LoginSchemaType) => {
    const {email, password} = data

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!existingUser) {
        throw new BadRequestError('Invalid email or password')
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password)

    if (!isPasswordValid) {
        throw new BadRequestError('Invalid email or password')
    }

    return {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt
    }
}
