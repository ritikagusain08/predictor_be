/*
  Warnings:

  - You are about to drop the `PredictionResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "rank"."PredictionResult";

-- CreateTable
CREATE TABLE "rank"."MatchLeaderboard" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL,
    "prvPoints" INTEGER NOT NULL DEFAULT 0,
    "prvRank" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchLeaderboard_userId_matchId_key" ON "rank"."MatchLeaderboard"("userId", "matchId");
