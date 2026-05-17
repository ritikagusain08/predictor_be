/*
  Warnings:

  - Changed the type of `playerSkill` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "master"."PlayerSkill" AS ENUM ('DRIVER', 'CONSTRUCTOR');

-- AlterTable
ALTER TABLE "master"."Player" DROP COLUMN "playerSkill",
ADD COLUMN     "playerSkill" "master"."PlayerSkill" NOT NULL;
