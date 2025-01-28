import { prisma } from "~/utils/prisma.server";

export async function searchPsychiatrists(filters: {
  insuranceId?: number;
  insuranceId2?: number;
  locationId?: number;
  ageGroupId?: number;
  medicationIds?: number[];
  conditionIds?: number[];
  preferTelehealth?: boolean;
}) {
  const {
    insuranceId,
    insuranceId2,
    locationId,
    ageGroupId,
    medicationIds,
    conditionIds,
    preferTelehealth,
  } = filters;

  const results = await prisma.psychiatrist.findMany({
    where: {
      ...(insuranceId || insuranceId2
        ? {
            AND: [
              ...(insuranceId ? [{ insurances: { some: { insuranceId } } }] : []),
              ...(insuranceId2 ? [{ insurances: { some: { insuranceId: insuranceId2 } } }] : []),
            ],
          }
        : {}),
      ...(locationId && { locations: { some: { locationId } } }),
      ...(ageGroupId && { ageGroups: { some: { ageGroupId } } }),
      ...(medicationIds &&
        medicationIds.length > 0 && {
          medicationRestrictions: { none: { medicationId: { in: medicationIds } } },
        }),
      ...(conditionIds &&
        conditionIds.length > 0 && {
          conditionRestrictions: { none: { conditionId: { in: conditionIds } } },
        }),
      ...(preferTelehealth ? { requiresInPersonFirstMeeting: false } : {}),
      numPatientsAccepted: { gt: 0 },
    },
    include: {
      insurances: true,
      locations: true,
      ageGroups: true,
      medicationRestrictions: true,
      conditionRestrictions: true,
    },
  });

  return results;
}

export async function getPsychiatristWithDetails(id: number) {
  return prisma.psychiatrist.findUnique({
    where: { id },
    include: {
      insurances: {
        include: {
          Insurance: { select: { id: true, name: true } },
        },
      },
      locations: {
        include: {
          Location: { select: { id: true, name: true } },
        },
      },
      ageGroups: {
        include: {
          AgeGroup: { select: { id: true, name: true } },
        },
      },
      conditionRestrictions: {
        include: {
          Condition: { select: { id: true, name: true } },
        },
      },
      medicationRestrictions: {
        include: {
          Medication: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export async function updatePsychiatrist(
  id: number,
  data: {
    firstName: string;
    lastName: string;
    credentials: string;
    numPatientsAccepted: number;
    requiresInPersonFirstMeeting: boolean;
    initialApptLength: number;
    followUpApptLength: number;
    notes: string;
    insurances: number[];
    locations: number[];
    ageGroups: number[];
    conditions: number[];
    medications: number[];
  }
) {
  await prisma.psychiatrist.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      credentials: data.credentials,
      numPatientsAccepted: data.numPatientsAccepted,
      requiresInPersonFirstMeeting: data.requiresInPersonFirstMeeting,
      initialApptLength: data.initialApptLength,
      followUpApptLength: data.followUpApptLength,
      notes: data.notes,
      insurances: {
        deleteMany: {},
        create: data.insurances.map((insuranceId) => ({
          insuranceId,
        })),
      },
      locations: {
        deleteMany: {},
        create: data.locations.map((locationId) => ({
          locationId,
        })),
      },
      ageGroups: {
        deleteMany: {},
        create: data.ageGroups.map((ageGroupId) => ({
          ageGroupId,
        })),
      },
      conditionRestrictions: {
        deleteMany: {},
        create: data.conditions.map((conditionId) => ({
          conditionId,
        })),
      },
      medicationRestrictions: {
        deleteMany: {},
        create: data.medications.map((medicationId) => ({
          medicationId,
        })),
      },
    },
  });
}

export async function createPsychiatrist(data: {
  firstName: string;
  lastName: string;
  credentials: string;
  numPatientsAccepted: number;
  requiresInPersonFirstMeeting: boolean;
  initialApptLength: number;
  followUpApptLength: number;
  notes: string;
  insurances: number[];
  locations: number[];
  ageGroups: number[];
  conditions: number[];
  medications: number[];
}) {
  return prisma.psychiatrist.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      credentials: data.credentials,
      numPatientsAccepted: data.numPatientsAccepted,
      requiresInPersonFirstMeeting: data.requiresInPersonFirstMeeting,
      initialApptLength: data.initialApptLength,
      followUpApptLength: data.followUpApptLength,
      notes: data.notes,
      insurances: {
        create: data.insurances.map((insuranceId) => ({ insuranceId })),
      },
      locations: {
        create: data.locations.map((locationId) => ({ locationId })),
      },
      ageGroups: {
        create: data.ageGroups.map((ageGroupId) => ({ ageGroupId })),
      },
      conditionRestrictions: {
        create: data.conditions.map((conditionId) => ({ conditionId })),
      },
      medicationRestrictions: {
        create: data.medications.map((medicationId) => ({ medicationId })),
      },
    },
  });
}

export async function deletePsychiatrist(id: number) {
  await prisma.psychiatrist.delete({
    where: { id },
  });
}

export async function getAllPsychiatrists() {
  return prisma.psychiatrist.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      credentials: true,
      numPatientsAccepted: true,
      requiresInPersonFirstMeeting: true,
      initialApptLength: true,
      followUpApptLength: true,
      notes: true,
      insurances: { select: { insuranceId: true } },
      locations: { select: { locationId: true } },
      ageGroups: { select: { ageGroupId: true } },
      conditionRestrictions: { select: { conditionId: true } },
      medicationRestrictions: { select: { medicationId: true } },
    },
    orderBy: { id: "asc" },
  });
}
