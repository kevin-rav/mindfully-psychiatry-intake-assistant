-- CreateTable
CREATE TABLE "Psychiatrist" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "credentials" TEXT NOT NULL,
    "numPatientsAccepted" INTEGER NOT NULL,
    "requiresInPersonFirstMeeting" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Psychiatrist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insurance" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Insurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgeGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AgeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PsychiatristInsurance" (
    "psychiatristId" INTEGER NOT NULL,
    "insuranceId" INTEGER NOT NULL,

    CONSTRAINT "PsychiatristInsurance_pkey" PRIMARY KEY ("psychiatristId","insuranceId")
);

-- CreateTable
CREATE TABLE "PsychiatristLocation" (
    "psychiatristId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "PsychiatristLocation_pkey" PRIMARY KEY ("psychiatristId","locationId")
);

-- CreateTable
CREATE TABLE "PsychiatristAgeGroup" (
    "psychiatristId" INTEGER NOT NULL,
    "ageGroupId" INTEGER NOT NULL,

    CONSTRAINT "PsychiatristAgeGroup_pkey" PRIMARY KEY ("psychiatristId","ageGroupId")
);

-- CreateTable
CREATE TABLE "PsychiatristCondition" (
    "psychiatristId" INTEGER NOT NULL,
    "conditionId" INTEGER NOT NULL,

    CONSTRAINT "PsychiatristCondition_pkey" PRIMARY KEY ("psychiatristId","conditionId")
);

-- CreateTable
CREATE TABLE "PsychiatristMedication" (
    "psychiatristId" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,

    CONSTRAINT "PsychiatristMedication_pkey" PRIMARY KEY ("psychiatristId","medicationId")
);

-- AddForeignKey
ALTER TABLE "PsychiatristInsurance" ADD CONSTRAINT "PsychiatristInsurance_psychiatristId_fkey" FOREIGN KEY ("psychiatristId") REFERENCES "Psychiatrist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristInsurance" ADD CONSTRAINT "PsychiatristInsurance_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "Insurance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristLocation" ADD CONSTRAINT "PsychiatristLocation_psychiatristId_fkey" FOREIGN KEY ("psychiatristId") REFERENCES "Psychiatrist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristLocation" ADD CONSTRAINT "PsychiatristLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristAgeGroup" ADD CONSTRAINT "PsychiatristAgeGroup_psychiatristId_fkey" FOREIGN KEY ("psychiatristId") REFERENCES "Psychiatrist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristAgeGroup" ADD CONSTRAINT "PsychiatristAgeGroup_ageGroupId_fkey" FOREIGN KEY ("ageGroupId") REFERENCES "AgeGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristCondition" ADD CONSTRAINT "PsychiatristCondition_psychiatristId_fkey" FOREIGN KEY ("psychiatristId") REFERENCES "Psychiatrist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristCondition" ADD CONSTRAINT "PsychiatristCondition_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristMedication" ADD CONSTRAINT "PsychiatristMedication_psychiatristId_fkey" FOREIGN KEY ("psychiatristId") REFERENCES "Psychiatrist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychiatristMedication" ADD CONSTRAINT "PsychiatristMedication_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
