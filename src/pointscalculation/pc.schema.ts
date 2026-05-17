import { z } from "zod";
export const CalculatePointsSchema = z.object({
    matchId: z.number('Match ID is required')
});


export const GenerateMatchLeaderboardSchema = z.object({
    userId: z.string('User ID is required'),
    matchId: z.number('Match ID is required'),
    rno: z.number('RNO is required'),
    points: z.number('Points is required'),
    rank: z.number('Rank is required'),
    prvPoints: z.number('Previous Points is required'),
    prvRank: z.number('Previous Rank is required'),
    trend: z.string('Trend is required')
});

export const GenerateSeasonLeaderboardSchema = z.object({
    userId: z.string('User ID is required'),
    points: z.number('Points is required'),
    rno: z.number('RNO is required'),
    rank: z.number('Rank is required'),
    prvPoints: z.number('Previous Points is required'),
    prvRank: z.number('Previous Rank is required'),
    trend: z.string('Trend is required')
});

export const GenerateMatchwiseLeagueLeaderboardSchema = z.object({
    userId: z.string('User ID is required'),
    leagueId: z.number('League ID is required'),
    matchId: z.number('Match ID is required'),
    rno: z.number('RNO is required'),
    points: z.number('Points is required'),
    rank: z.number('Rank is required'),
    prvPoints: z.number('Previous Points is required'),
    prvRank: z.number('Previous Rank is required'),
    trend: z.string('Trend is required')
});

export const GenerateSeasonLeagueLeaderboardSchema = z.object({
    userId: z.string('User ID is required'),
    leagueId: z.number('League ID is required'),
    points: z.number('Points is required'),
    rno: z.number('RNO is required'),
    rank: z.number('Rank is required'),
    prvPoints: z.number('Previous Points is required'),
    prvRank: z.number('Previous Rank is required'),
    trend: z.string('Trend is required')
});

export type CalculatePointsSchemaType = z.infer<typeof CalculatePointsSchema>;
export type GenerateMatchLeaderboardSchemaType = z.infer<typeof GenerateMatchLeaderboardSchema>;
export type GenerateSeasonLeaderboardSchemaType = z.infer<typeof GenerateSeasonLeaderboardSchema>;
export type GenerateMatchwiseLeagueLeaderboardSchemaType = z.infer<typeof GenerateMatchwiseLeagueLeaderboardSchema>;
export type GenerateSeasonLeagueLeaderboardSchemaType = z.infer<typeof GenerateSeasonLeagueLeaderboardSchema>;