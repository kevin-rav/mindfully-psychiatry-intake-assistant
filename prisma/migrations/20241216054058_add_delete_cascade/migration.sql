-- DropForeignKey
ALTER TABLE "PsychiatristAgeGroup" DROP CONSTRAINT "PsychiatristAgeGroup_psychiatristId_fkey";

-- DropForeignKey
ALTER TABLE "PsychiatristCondition" DROP CONSTRAINT "PsychiatristCondition_psychiatristId_fkey";

-- DropForeignKey
ALTER TABLE "PsychiatristInsurance" DROP CONSTRAINT "PsychiatristInsurance_psychiatristId_fkey";

-- DropForeignKey
ALTER TABLE "PsychiatristLocation" DROP CONSTRAINT "PsychiatristLocation_psychiatristId_fkey";

-- DropForeignKey
ALTER TABLE "PsychiatristMedication" DROP CONSTRAINT "PsychiatristMedication_psychiatristId_fkey";

-- AddForeignKey
ALTER TABLE "PsychiatristInsurance" ADD CONSTRAINT "PsychiatristInsurance_psychiatristId_fkey" FOREIGN KEY ("psychiatristId") REFERENCES "Psychiatrist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristLocation" ADD CONSTRAINT "PsychiatristLocation_psychiatristId_fkey" FOREIGN KEY ("psychiatristId") REFERENCES "Psychiatrist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristAgeGroup" ADD CONSTRAINT "PsychiatristAgeGroup_psychiatristId_fkey" FOREIGN KEY ("psychiatristId") REFERENCES "Psychiatrist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristCondition" ADD CONSTRAINT "PsychiatristCondition_psychiatristId_fkey" FOREIGN KEY ("psychiatristId") REFERENCES "Psychiatrist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristMedication" ADD CONSTRAINT "PsychiatristMedication_psychiatristId_fkey" FOREIGN KEY ("psychiatristId") REFERENCES "Psychiatrist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
