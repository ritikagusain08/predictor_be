/*
  Warnings:

  - You are about to drop the column `points` on the `PredictionAnswer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gameplay"."Prediction" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "hasBooster" DROP DEFAULT;

-- AlterTable
ALTER TABLE "gameplay"."PredictionAnswer" DROP COLUMN "points";
