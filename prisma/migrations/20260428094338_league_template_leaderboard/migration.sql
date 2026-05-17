/*
  Warnings:

  - Added the required column `templateId` to the `LeagueMatchwiseLeaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateId` to the `LeagueSeasonLeaderboard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rank"."LeagueMatchwiseLeaderboard" ADD COLUMN     "templateId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rank"."LeagueSeasonLeaderboard" ADD COLUMN     "templateId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "rank"."LeagueMatchwiseLeaderboard" ADD CONSTRAINT "LeagueMatchwiseLeaderboard_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "league"."LeagueTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank"."LeagueSeasonLeaderboard" ADD CONSTRAINT "LeagueSeasonLeaderboard_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "league"."LeagueTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
