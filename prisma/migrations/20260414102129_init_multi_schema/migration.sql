/*
  Warnings:

  - You are about to drop the column `questionId` on the `PredictionResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rank"."PredictionResult" DROP COLUMN "questionId";
