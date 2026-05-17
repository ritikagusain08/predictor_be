import { z } from 'zod'

export const CreatePlayerSchema = z.object({
    playerId: z.string('Player ID is required'),
    playerName: z.string('Player Name is required'),
    playerSkill: z.enum(['DRIVER', 'CONSTRUCTOR']),
    isActive: z.boolean('Is Active is required'),
    teamId: z.string('Team ID is required')
})

export type CreatePlayerSchemaType = z.infer<typeof CreatePlayerSchema>