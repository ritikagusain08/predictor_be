/*
  Warnings:

  - A unique constraint covering the columns `[teamId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teamId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "master"."Player" DROP CONSTRAINT "Player_teamId_fkey";

-- AlterTable
ALTER TABLE "master"."Team" ADD COLUMN     "teamId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamId_key" ON "master"."Team"("teamId");

-- AddForeignKey
ALTER TABLE "master"."Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "master"."Team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
