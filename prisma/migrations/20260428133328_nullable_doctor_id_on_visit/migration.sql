-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_doctorId_fkey";

-- AlterTable
ALTER TABLE "Visit" ALTER COLUMN "doctorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
