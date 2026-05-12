-- CreateTable
CREATE TABLE "rank"."SeasonLeaderboard" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL,
    "prvPoints" INTEGER NOT NULL DEFAULT 0,
    "prvRank" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeasonLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeasonLeaderboard_userId_key" ON "rank"."SeasonLeaderboard"("userId");
