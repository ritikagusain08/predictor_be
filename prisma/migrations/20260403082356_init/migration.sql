/*
  Warnings:

  - Added the required column `SessionEndDate` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SessionStartDate` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "master"."Match" ADD COLUMN     "SessionEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "SessionStartDate" TIMESTAMP(3) NOT NULL;
