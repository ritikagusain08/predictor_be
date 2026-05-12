import { z } from 'zod'

export const CreateQuestionSchema = z.object({
    questionNo: z.number('Question Number is required'),
    questionDescription: z.string('Question Description is required'),
    questionType: z.string('Question Type is required'),
    choiceLimit: z.number('Choice Limit is required'),
    questionStatus: z.number('Question Status is required'),
    matchId: z.number('Match ID is required'),
    options: z.array(z.object({
        optionId: z.number('Option ID is required'),
        optionDesc: z.string('Option Text is required'),
        points: z.number('Option Points is required'),
        position: z.number('Position is required'),
        isCorrect: z.boolean('Is Correct is required')
    }))
})


export const UpdateQuestionSchema = z.object({
    questionNo: z.number('Question Number is required').optional(),
    questionDescription: z.string('Question Description is required').optional(),
    questionType: z.string('Question Type is required').optional(),
    choiceLimit: z.number('Choice Limit is required').optional(),
    questionStatus: z.number('Question Status is required').optional(),
    matchId: z.number('Match ID is required').optional(),
    options: z.array(z.object({
        optionId: z.number('Option ID is required').optional(),
        optionDesc: z.string('Option Text is required').optional(),
        points: z.number('Option Points is required').optional(),
        position: z.number('Position is required').optional(),
        isCorrect: z.boolean('Is Correct is required').optional()
    }))
})

export const ResolveQuestionSchema = z.object({
    questionId: z.number('Question ID is required'),
    options: z.array(z.object({
        isCorrect: z.boolean('Is Correct is required').optional(),
        position: z.number('Position is required').optional(),
        optionId: z.number('Option ID is required').optional()
    }))
})

export type CreateQuestionSchemaType = z.infer<typeof CreateQuestionSchema>
export type UpdateQuestionSchemaType = z.infer<typeof UpdateQuestionSchema> & { questionId: number }
export type ResolveQuestionSchemaType = z.infer<typeof ResolveQuestionSchema>
