/*
  Warnings:

  - Added the required column `hasBooster` to the `PredictionAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gameplay"."PredictionAnswer" ADD COLUMN     "hasBooster" BOOLEAN NOT NULL;
