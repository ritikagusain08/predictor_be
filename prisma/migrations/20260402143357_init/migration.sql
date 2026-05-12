-- DropForeignKey
ALTER TABLE "admin"."Option" DROP CONSTRAINT "Option_questionId_fkey";

-- AddForeignKey
ALTER TABLE "admin"."Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "admin"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
