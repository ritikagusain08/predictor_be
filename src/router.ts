import type { FastifyInstance } from 'fastify'
import authRoutes from './auth/auth.routes.ts';
import matchRoutes from './matches/match.routes.ts';
import teamRoutes from './teams/team.routes.ts';
import playerRoutes from './players/player.routes.ts';
import {questionsRoutes} from './questions/questions.routes.ts';
import predictionRoutes from './predictions/prediction.routes.ts';
import seedRoutes from './scripts/seed.routes.ts';
import matchstatusupdateRoutes from './services/matchstatusupdate.route.ts';
import pcRoutes from './pointscalculation/pc.routes.ts';
import {leaderboardRoutes} from './leaderboard/leaderboard.routes.ts';
import {adminLeagueTypeRoutes} from './adminLeague/adminLeagueType.route.ts';
import adminLeagueRoutes from './adminLeague/adminLeague.routes.ts';
import leagueRoutes from './leagues/league.routes.ts';

export default async function router(app: FastifyInstance) {
   await app.register(authRoutes, { prefix: '/api/auth' })
   await app.register(matchRoutes, { prefix: '/admin/api/matches' })
   await app.register(teamRoutes, { prefix: '/admin/api/teams' })
   await app.register(playerRoutes, { prefix: '/admin/api/players' })
   await app.register(questionsRoutes, { prefix: '/admin/api/questions' })
   await app.register(predictionRoutes, { prefix: '/api/predictions' })
   await app.register(seedRoutes, { prefix: '/admin/api/seed' })
   await app.register(matchstatusupdateRoutes, { prefix: '/admin/api/matchstatusupdate' })
   await app.register(pcRoutes, { prefix: '/admin/api/pointscalculation' })
   await app.register(leaderboardRoutes, { prefix: '/api/leaderboard' })
   await app.register(adminLeagueTypeRoutes, { prefix: '/admin/api/adminleaguetype' })
   await app.register(adminLeagueRoutes, { prefix: '/admin/api/adminleague' })
   await app.register(leagueRoutes, { prefix: '/api/league' })
}