import { z } from 'zod'

export const CreateMatchSchema = z.object({
    matchId: z.number('Match ID is required'),
    gamedayId: z.number('Gameday ID is required'),
    circuitLocation: z.string('Circuit Location is required'),
    circuitShortName: z.string('Circuit Short Name is required'),
    sessionStartDate: z.date('Session Start Date is required'),
    sessionEndDate: z.date('Session End Date is required'),
    season: z.string('Season is required'),
    status: z.number('Status is required')
})

export type CreateMatchSchemaType = z.infer<typeof CreateMatchSchema>