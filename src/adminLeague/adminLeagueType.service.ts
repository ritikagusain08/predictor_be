import { prisma } from "../config/prisma.js"
import type { CreateAdminLeagueTypeSchemaType, UpdateAdminLeagueTypeSchemaType, DeleteAdminLeagueTypeSchemaType, GetAdminLeagueTypeSchemaType, GetAllAdminLeagueTypeSchemaType } from "./adminleagueType.schema.ts"
import { BadRequestError } from "../errors/HttpError.js"


export const createAdminLeagueType = async (data: CreateAdminLeagueTypeSchemaType) => {
        const newLeagueType = await prisma.leagueTemplate.create({
            data: {
                name: data.name,
                requireLeagueCode: data.requireLeagueCode,
                isSearchable: data.isSearchable,
                allowUserLeave: data.allowUserLeave,
                allowRenaming: data.allowRenaming,
                allowAdminDelete: data.allowAdminDelete,
                allowMemberRemoval: data.allowMemberRemoval,
                creatorRole: data.creatorRole,
                hasMatchRange: data.hasMatchRange,
                defaultMaxMembers: data.defaultMaxMembers,
                maxLeaguesPerUser: data.maxLeaguesPerUser ?? null,
            }
        })
        return { message: "League Type Created Successfully" , data: newLeagueType}
}

export const updateAdminLeagueType = async (data: UpdateAdminLeagueTypeSchemaType) => {
        const { id, ...fields } = data

        const isLeagueTypeExist = await prisma.leagueTemplate.findFirst({
            where: {
                id
            }
        })

        if(!isLeagueTypeExist){
            throw new BadRequestError("League Type does not exist")
        }

        const updateData = Object.fromEntries(Object.entries(fields).filter(([_, value]) => value !== undefined));

        const updatedLeagueType = await prisma.leagueTemplate.update({
            where: {
                id
            },
            data: updateData
        })
        return { message: "League Type Updated Successfully" , data: updatedLeagueType}
}

export const deleteAdminLeagueType = async (data: DeleteAdminLeagueTypeSchemaType) => {
        const isLeagueTypeExist = await prisma.leagueTemplate.findFirst({
            where: {
                id: data.id
            }
        })

        if(!isLeagueTypeExist){
            throw new BadRequestError("League Type does not exist")
        }

        const deletedLeagueType = await prisma.leagueTemplate.delete({
            where: {
                id: data.id
            }
        })
        return { message: "League Type Deleted Successfully" , data: deletedLeagueType}
}



export const getAdminLeagueType = async (data: GetAdminLeagueTypeSchemaType) => {
        const isLeagueTypeExist = await prisma.leagueTemplate.findFirst({
            where: {
                id: data.id
            }
        })

        if(!isLeagueTypeExist){
            throw new BadRequestError("League Type does not exist")
        }

        const leagueType = await prisma.leagueTemplate.findFirst({
            where: {
                id: data.id
            }
        })
        return { message: "League Type Fetched Successfully" , data: leagueType}
}

export const getAllAdminLeagueTypes = async () => {
        const leagueTypes = await prisma.leagueTemplate.findMany()
        return { message: "League Types Fetched Successfully" , data: leagueTypes}
}
