/*
  Warnings:

  - You are about to drop the `PrivateLeague` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivateLeagueMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicLeague` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicLeagueMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivateLeagueMatchLeaderboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivateLeagueSeasonLeaderboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicLeagueMatchLeaderboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicLeagueSeasonLeaderboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "league"."CreatorRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "league"."PrivateLeague" DROP CONSTRAINT "PrivateLeague_matchId_fkey";

-- DropForeignKey
ALTER TABLE "league"."PrivateLeague" DROP CONSTRAINT "PrivateLeague_userId_fkey";

-- DropForeignKey
ALTER TABLE "league"."PrivateLeagueMember" DROP CONSTRAINT "PrivateLeagueMember_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "league"."PrivateLeagueMember" DROP CONSTRAINT "PrivateLeagueMember_matchId_fkey";

-- DropForeignKey
ALTER TABLE "league"."PrivateLeagueMember" DROP CONSTRAINT "PrivateLeagueMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "league"."PublicLeague" DROP CONSTRAINT "PublicLeague_matchId_fkey";

-- DropForeignKey
ALTER TABLE "league"."PublicLeague" DROP CONSTRAINT "PublicLeague_userId_fkey";

-- DropForeignKey
ALTER TABLE "league"."PublicLeagueMember" DROP CONSTRAINT "PublicLeagueMember_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "league"."PublicLeagueMember" DROP CONSTRAINT "PublicLeagueMember_matchId_fkey";

-- DropForeignKey
ALTER TABLE "league"."PublicLeagueMember" DROP CONSTRAINT "PublicLeagueMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "rank"."PrivateLeagueMatchLeaderboard" DROP CONSTRAINT "PrivateLeagueMatchLeaderboard_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "rank"."PrivateLeagueMatchLeaderboard" DROP CONSTRAINT "PrivateLeagueMatchLeaderboard_matchId_fkey";

-- DropForeignKey
ALTER TABLE "rank"."PrivateLeagueMatchLeaderboard" DROP CONSTRAINT "PrivateLeagueMatchLeaderboard_userId_fkey";

-- DropForeignKey
ALTER TABLE "rank"."PrivateLeagueSeasonLeaderboard" DROP CONSTRAINT "PrivateLeagueSeasonLeaderboard_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "rank"."PrivateLeagueSeasonLeaderboard" DROP CONSTRAINT "PrivateLeagueSeasonLeaderboard_userId_fkey";

-- DropForeignKey
ALTER TABLE "rank"."PublicLeagueMatchLeaderboard" DROP CONSTRAINT "PublicLeagueMatchLeaderboard_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "rank"."PublicLeagueMatchLeaderboard" DROP CONSTRAINT "PublicLeagueMatchLeaderboard_matchId_fkey";

-- DropForeignKey
ALTER TABLE "rank"."PublicLeagueMatchLeaderboard" DROP CONSTRAINT "PublicLeagueMatchLeaderboard_userId_fkey";

-- DropForeignKey
ALTER TABLE "rank"."PublicLeagueSeasonLeaderboard" DROP CONSTRAINT "PublicLeagueSeasonLeaderboard_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "rank"."PublicLeagueSeasonLeaderboard" DROP CONSTRAINT "PublicLeagueSeasonLeaderboard_userId_fkey";

-- DropTable
DROP TABLE "league"."PrivateLeague";

-- DropTable
DROP TABLE "league"."PrivateLeagueMember";

-- DropTable
DROP TABLE "league"."PublicLeague";

-- DropTable
DROP TABLE "league"."PublicLeagueMember";

-- DropTable
DROP TABLE "rank"."PrivateLeagueMatchLeaderboard";

-- DropTable
DROP TABLE "rank"."PrivateLeagueSeasonLeaderboard";

-- DropTable
DROP TABLE "rank"."PublicLeagueMatchLeaderboard";

-- DropTable
DROP TABLE "rank"."PublicLeagueSeasonLeaderboard";

-- CreateTable
CREATE TABLE "league"."LeagueTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "requireLeagueCode" BOOLEAN NOT NULL DEFAULT false,
    "isSearchable" BOOLEAN NOT NULL DEFAULT false,
    "allowUserLeave" BOOLEAN NOT NULL DEFAULT false,
    "allowRenaming" BOOLEAN NOT NULL DEFAULT false,
    "allowAdminDelete" BOOLEAN NOT NULL DEFAULT false,
    "allowMemberRemoval" BOOLEAN NOT NULL DEFAULT false,
    "creatorRole" "league"."CreatorRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hasMatchRange" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LeagueTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league"."League" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "leagueName" TEXT NOT NULL,
    "leagueCode" TEXT NOT NULL,
    "createdAtMatchId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "startMatchId" INTEGER,
    "endMatchId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league"."LeagueMember" (
    "id" SERIAL NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAtMatchId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isDisjoined" BOOLEAN NOT NULL DEFAULT false,
    "isRemoved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeagueMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueTemplate_name_key" ON "league"."LeagueTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "League_leagueCode_key" ON "league"."League"("leagueCode");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueMember_leagueId_userId_key" ON "league"."LeagueMember"("leagueId", "userId");

-- AddForeignKey
ALTER TABLE "league"."League" ADD CONSTRAINT "League_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "league"."LeagueTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."League" ADD CONSTRAINT "League_createdAtMatchId_fkey" FOREIGN KEY ("createdAtMatchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."League" ADD CONSTRAINT "League_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."LeagueMember" ADD CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"."League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."LeagueMember" ADD CONSTRAINT "LeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "login"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league"."LeagueMember" ADD CONSTRAINT "LeagueMember_joinedAtMatchId_fkey" FOREIGN KEY ("joinedAtMatchId") REFERENCES "master"."Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;
