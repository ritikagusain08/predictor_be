-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "rank";

-- CreateTable
CREATE TABLE "rank"."PredictionResult" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL,
    "prvPoints" INTEGER NOT NULL DEFAULT 0,
    "prvRank" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PredictionResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PredictionResult_userId_matchId_key" ON "rank"."PredictionResult"("userId", "matchId");
