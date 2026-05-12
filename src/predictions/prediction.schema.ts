import { z } from 'zod'

export const CreatePredictionSchema = z.object({
    questionId: z.number('Question ID is required'),
    matchId: z.number('Match ID is required'),
    hasBooster: z.boolean('Has Booster is required'),
    answers: z.array(z.object({
        optionId: z.number('Option ID is required'),
        position: z.number('Position is required')
    }))
})


export type CreatePredictionSchemaType = z.infer<typeof CreatePredictionSchema>
