-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "league";

-- CreateTable
CREATE TABLE "league"."PrivateLeague" (
    "id" SERIAL NOT NULL,
    "leagueName" TEXT NOT NULL,
    "leagueCode" TEXT NOT NULL,
    "maximumMembers" INTEGER NOT NULL DEFAULT 999999,
    "membersCount" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateLeague_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league"."PrivateLeagueMember" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isDisjoined" BOOLEAN NOT NULL DEFAULT false,
    "isRemoved" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateLeagueMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivateLeague_leagueCode_key" ON "league"."PrivateLeague"("leagueCode");

-- AddForeignKey
ALTER TABLE "rank"."MatchLeaderboard" ADD CONSTRAINT "MatchLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."SeasonLeaderboard" ADD CONSTRAINT "SeasonLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."PrivateLeague" ADD CONSTRAINT "PrivateLeague_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."PrivateLeague" ADD CONSTRAINT "PrivateLeague_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."PrivateLeagueMember" ADD CONSTRAINT "PrivateLeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"."PrivateLeague"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."PrivateLeagueMember" ADD CONSTRAINT "PrivateLeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."PrivateLeagueMember" ADD CONSTRAINT "PrivateLeagueMember_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;
