import { z } from "zod";

export const CreateLeagueSchema = z.object({
    leagueName: z.string(),
    templateId: z.number(),
    maximumMembers: z.number().optional()
})

export const JoinUserLeagueSchema = z.object({
    leagueId: z.number(),
})

export const JoinLeagueByCodeSchema = z.object({
    leagueCode: z.string(),
})

export const UpdateLeagueSchema = z.object({
    id: z.number(),
    leagueName: z.string()
})

export type CreateLeagueSchemaType = z.infer<typeof CreateLeagueSchema>
export type JoinLeagueSchemaType = z.infer<typeof JoinUserLeagueSchema>
export type JoinLeagueByCodeSchemaType = z.infer<typeof JoinLeagueByCodeSchema>
export type UpdateLeagueSchemaType = z.infer<typeof UpdateLeagueSchema>