/*
  Warnings:

  - You are about to drop the column `SessionEndDate` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `SessionStartDate` on the `Match` table. All the data in the column will be lost.
  - Added the required column `sessionEndDate` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionStartDate` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "master"."Match" DROP COLUMN "SessionEndDate",
DROP COLUMN "SessionStartDate",
ADD COLUMN     "sessionEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sessionStartDate" TIMESTAMP(3) NOT NULL;
