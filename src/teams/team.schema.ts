import { z } from 'zod'

export const CreateTeamSchema = z.object({
    teamId: z.string('Team ID is required'),
    teamName: z.string('Team Name is required'),
    teamShortName: z.string('Team Short Name is required')
})

export type CreateTeamSchemaType = z.infer<typeof CreateTeamSchema>