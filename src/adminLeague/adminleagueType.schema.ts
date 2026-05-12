import { z } from "zod";


// create league type
export const createAdminLeagueTypeSchema = z.object({
    name: z.string(),
    requireLeagueCode: z.boolean(),
    isSearchable: z.boolean(),
    allowUserLeave: z.boolean(),
    allowRenaming: z.boolean(),
    allowAdminDelete: z.boolean(),
    allowMemberRemoval: z.boolean(),
    creatorRole: z.enum(["ADMIN", "USER"]),
    hasMatchRange: z.boolean(),
    defaultMaxMembers: z.number(),
    maxLeaguesPerUser: z.number().optional(),
})

export const updateAdminLeagueTypeSchema = z.object({
    id: z.number().optional(),   // optional in body, usually taken from params
}).merge(
    createAdminLeagueTypeSchema.partial()  // all rule fields are optional
)


export const deleteAdminLeagueTypeSchema = z.object({
    id: z.number()
})

export const getAdminLeagueTypeSchema = z.object({
    id: z.number()
})

export const getAllAdminLeagueTypeSchema = z.object({})

export type CreateAdminLeagueTypeSchemaType = z.infer<typeof createAdminLeagueTypeSchema>;
export type UpdateAdminLeagueTypeSchemaType = z.infer<typeof updateAdminLeagueTypeSchema>;
export type DeleteAdminLeagueTypeSchemaType = z.infer<typeof deleteAdminLeagueTypeSchema>;
export type GetAdminLeagueTypeSchemaType = z.infer<typeof getAdminLeagueTypeSchema>;
export type GetAllAdminLeagueTypeSchemaType = z.infer<typeof getAllAdminLeagueTypeSchema>;
