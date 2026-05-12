-- CreateTable
CREATE TABLE "league"."PublicLeague" (
    "id" SERIAL NOT NULL,
    "leagueName" TEXT NOT NULL,
    "leagueCode" TEXT NOT NULL,
    "maximumMembers" INTEGER NOT NULL DEFAULT 999999,
    "membersCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicLeague_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league"."PublicLeagueMember" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicLeagueMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank"."PublicLeagueMatchLeaderboard" (
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

    CONSTRAINT "PublicLeagueMatchLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank"."PublicLeagueSeasonLeaderboard" (
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

    CONSTRAINT "PublicLeagueSeasonLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicLeague_leagueCode_key" ON "league"."PublicLeague"("leagueCode");

-- CreateIndex
CREATE UNIQUE INDEX "PublicLeagueMember_leagueId_userId_key" ON "league"."PublicLeagueMember"("leagueId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicLeagueMatchLeaderboard_userId_leagueId_matchId_key" ON "rank"."PublicLeagueMatchLeaderboard"("userId", "leagueId", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicLeagueSeasonLeaderboard_userId_leagueId_key" ON "rank"."PublicLeagueSeasonLeaderboard"("userId", "leagueId");

-- AddForeignKey
ALTER TABLE "league"."PublicLeague" ADD CONSTRAINT "PublicLeague_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."PublicLeague" ADD CONSTRAINT "PublicLeague_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."PublicLeagueMember" ADD CONSTRAINT "PublicLeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"."PublicLeague"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."PublicLeagueMember" ADD CONSTRAINT "PublicLeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."PublicLeagueMember" ADD CONSTRAINT "PublicLeagueMember_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."PublicLeagueMatchLeaderboard" ADD CONSTRAINT "PublicLeagueMatchLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."PublicLeagueMatchLeaderboard" ADD CONSTRAINT "PublicLeagueMatchLeaderboard_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"."PublicLeague"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."PublicLeagueMatchLeaderboard" ADD CONSTRAINT "PublicLeagueMatchLeaderboard_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."PublicLeagueSeasonLeaderboard" ADD CONSTRAINT "PublicLeagueSeasonLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."PublicLeagueSeasonLeaderboard" ADD CONSTRAINT "PublicLeagueSeasonLeaderboard_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"."PublicLeague"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
