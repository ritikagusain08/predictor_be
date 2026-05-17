-- CreateTable
CREATE TABLE "rank"."LeagueMatchwiseLeaderboard" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,
    "rno" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL,
    "prvPoints" INTEGER NOT NULL DEFAULT 0,
    "prvRank" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeagueMatchwiseLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank"."LeagueSeasonLeaderboard" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "rno" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL,
    "prvPoints" INTEGER NOT NULL DEFAULT 0,
    "prvRank" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeagueSeasonLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeagueMatchwiseLeaderboard_matchId_idx" ON "rank"."LeagueMatchwiseLeaderboard"("matchId");

-- CreateIndex
CREATE INDEX "LeagueMatchwiseLeaderboard_userId_idx" ON "rank"."LeagueMatchwiseLeaderboard"("userId");

-- CreateIndex
CREATE INDEX "LeagueMatchwiseLeaderboard_points_idx" ON "rank"."LeagueMatchwiseLeaderboard"("points");

-- CreateIndex
CREATE INDEX "LeagueMatchwiseLeaderboard_leagueId_rank_idx" ON "rank"."LeagueMatchwiseLeaderboard"("leagueId", "rank");

-- CreateIndex
CREATE INDEX "LeagueMatchwiseLeaderboard_matchId_rank_idx" ON "rank"."LeagueMatchwiseLeaderboard"("matchId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueMatchwiseLeaderboard_userId_matchId_leagueId_key" ON "rank"."LeagueMatchwiseLeaderboard"("userId", "matchId", "leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueSeasonLeaderboard_userId_leagueId_key" ON "rank"."LeagueSeasonLeaderboard"("userId", "leagueId");

-- AddForeignKey
ALTER TABLE "rank"."LeagueMatchwiseLeaderboard" ADD CONSTRAINT "LeagueMatchwiseLeaderboard_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"."League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."LeagueMatchwiseLeaderboard" ADD CONSTRAINT "LeagueMatchwiseLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."LeagueMatchwiseLeaderboard" ADD CONSTRAINT "LeagueMatchwiseLeaderboard_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."LeagueSeasonLeaderboard" ADD CONSTRAINT "LeagueSeasonLeaderboard_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"."League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."LeagueSeasonLeaderboard" ADD CONSTRAINT "LeagueSeasonLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
