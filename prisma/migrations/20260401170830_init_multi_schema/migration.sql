/*
  Warnings:

  - A unique constraint covering the columns `[playerId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playerId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "master"."Player" ADD COLUMN     "playerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_playerId_key" ON "master"."Player"("playerId");
