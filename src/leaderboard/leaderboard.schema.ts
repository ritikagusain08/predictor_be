import { z } from 'zod'

export const GetMatchLeaderboardSchema = z.object({
    matchId: z.number('Match ID is required'),
    userId: z.string('User ID is required'),
    rno: z.number('RNO is required'),
    rank: z.number('Rank is required'),
    points: z.number('Points is required'),
    prvPoints: z.number('Previous Points is required'),
    prvRank: z.number('Previous Rank is required'),
    trend: z.string('Trend is required'),
    user: z.object({
        username: z.string('Username is required')
    })
})


export const GetSeasonLeaderboardSchema = z.object({
    userId: z.string('User ID is required'),
    rank: z.number('Rank is required'),
    rno: z.number('RNO is required'),
    points: z.number('Points is required'),
    prvPoints: z.number('Previous Points is required'),
    prvRank: z.number('Previous Rank is required'),
    trend: z.string('Trend is required'),
    user: z.object({
        username: z.string('Username is required')
    })
})

export const GetLeagueMatchwiseLeaderboardSchema = z.object({
    leagueId: z.number('League ID is required'),
    matchId: z.number('Match ID is required'),
    userId: z.string('User ID is required'),
    rank: z.number('Rank is required'),
    points: z.number('Points is required'),
    prvPoints: z.number('Previous Points is required'),
    prvRank: z.number('Previous Rank is required'),
    trend: z.string('Trend is required'),
    user: z.object({
        username: z.string('Username is required')
    })
})

export const GetLeagueSeasonLeaderboardSchema = z.object({
    leagueId: z.number('League ID is required'),
    userId: z.string('User ID is required'),
    rank: z.number('Rank is required'),
    points: z.number('Points is required'),
    prvPoints: z.number('Previous Points is required'),
    prvRank: z.number('Previous Rank is required'),
    trend: z.string('Trend is required'),
    user: z.object({
        username: z.string('Username is required')
    })
})

export type GetLeagueSeasonLeaderboardSchemaType = z.infer<typeof GetLeagueSeasonLeaderboardSchema>;
export type GetLeagueMatchwiseLeaderboardSchemaType = z.infer<typeof GetLeagueMatchwiseLeaderboardSchema>;
export type GetMatchLeaderboardSchemaType = z.infer<typeof GetMatchLeaderboardSchema>;
export type GetSeasonLeaderboardSchemaType = z.infer<typeof GetSeasonLeaderboardSchema>;
