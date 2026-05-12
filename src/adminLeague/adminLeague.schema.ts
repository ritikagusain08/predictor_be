import { z } from "zod";

export const createAdminLeagueSchema = z.object({
    leagueName: z.string().min(3).max(50),
    templateId: z.number(),
    userId: z.string(),
    createdAtMatchId: z.number(),
    startMatchId: z.number().optional(),
    endMatchId: z.number().optional(),
    maximumMembers: z.number().optional(),
});

export const updateAdminLeagueSchema = z.object({
    id: z.number(),
    leagueName: z.string().min(3).max(50).optional(),
    templateId: z.number().optional(),
    userId: z.string().optional(),
    createdAtMatchId: z.number().optional(),
    startMatchId: z.number().optional(),
    endMatchId: z.number().optional(),
    maximumMembers: z.number().optional(),
});

export type CreateAdminLeagueSchemaType = z.infer<typeof createAdminLeagueSchema>;
export type UpdateAdminLeagueSchemaType = z.infer<typeof updateAdminLeagueSchema>;