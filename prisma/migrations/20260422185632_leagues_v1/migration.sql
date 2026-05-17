-- AlterTable
ALTER TABLE "league"."League" ADD COLUMN     "maximumMembers" INTEGER NOT NULL DEFAULT 999999,
ADD COLUMN     "membersCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "league"."LeagueTemplate" ADD COLUMN     "defaultMaxMembers" INTEGER NOT NULL DEFAULT 999999,
ADD COLUMN     "maxLeaguesPerUser" INTEGER;
