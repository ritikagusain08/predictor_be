/*
  Warnings:

  - You are about to drop the column `hasBooster` on the `PredictionAnswer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gameplay"."Prediction" ADD COLUMN     "hasBooster" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "gameplay"."PredictionAnswer" DROP COLUMN "hasBooster";
