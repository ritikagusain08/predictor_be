/*
  Warnings:

  - A unique constraint covering the columns `[leagueId,userId]` on the table `PrivateLeagueMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "rank"."PrivateLeagueMatchLeaderboard" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rno" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "prvPoints" INTEGER NOT NULL DEFAULT 0,
    "prvRank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateLeagueMatchLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank"."PrivateLeagueSeasonLeaderboard" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rno" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "prvPoints" INTEGER NOT NULL DEFAULT 0,
    "prvRank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateLeagueSeasonLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivateLeagueMatchLeaderboard_userId_leagueId_matchId_key" ON "rank"."PrivateLeagueMatchLeaderboard"("userId", "leagueId", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateLeagueSeasonLeaderboard_userId_leagueId_key" ON "rank"."PrivateLeagueSeasonLeaderboard"("userId", "leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateLeagueMember_leagueId_userId_key" ON "league"."PrivateLeagueMember"("leagueId", "userId");

-- AddForeignKey
ALTER TABLE "rank"."PrivateLeagueMatchLeaderboard" ADD CONSTRAINT "PrivateLeagueMatchLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."PrivateLeagueMatchLeaderboard" ADD CONSTRAINT "PrivateLeagueMatchLeaderboard_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"."PrivateLeague"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."PrivateLeagueMatchLeaderboard" ADD CONSTRAINT "PrivateLeagueMatchLeaderboard_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."PrivateLeagueSeasonLeaderboard" ADD CONSTRAINT "PrivateLeagueSeasonLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."PrivateLeagueSeasonLeaderboard" ADD CONSTRAINT "PrivateLeagueSeasonLeaderboard_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"."PrivateLeague"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
