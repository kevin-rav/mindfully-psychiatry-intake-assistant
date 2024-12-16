import { prisma } from "~/utils/prisma.server";

// Fetch all insurance options
export async function getInsuranceOptions() {
  return prisma.insurance.findMany();
}

// Fetch all location options
export async function getLocationOptions() {
  return prisma.location.findMany();
}

// Fetch all age group options
export async function getAgeGroupOptions() {
  return prisma.ageGroup.findMany();
}

// Fetch all medication options
export async function getMedicationOptions() {
  return prisma.medication.findMany();
}

// Fetch all condition options
export async function getConditionOptions() {
  return prisma.condition.findMany();
}

// Search psychiatrists based on provided filters
export async function searchPsychiatrists(filters: {
  insuranceId?: number;
  locationId?: number;
  ageGroupId?: number;
  medicationIds?: number[];
  conditionIds?: number[];
  preferTelehealth?: boolean;
}) {
  const { insuranceId, locationId, ageGroupId, medicationIds, conditionIds, preferTelehealth } = filters;

  return prisma.psychiatrist.findMany({
    where: {
      ...(insuranceId && { insurances: { some: { insuranceId } } }),
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
      // Filter by telehealth preference if specified
      ...(preferTelehealth
        ? { requiresInPersonFirstMeeting: false } // Show only psychiatrists who allow telehealth
        : {}), // If not checked, include all psychiatrists

      // Only include psychiatrists accepting new patients
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
}

// Fetch psychiatrist details with relationships
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

// Fetch all related entities
export async function getAllEntities() {
  const [allInsurances, allLocations, allAgeGroups, allConditions, allMedications] = await Promise.all([
    prisma.insurance.findMany({ select: { id: true, name: true } }),
    prisma.location.findMany({ select: { id: true, name: true } }),
    prisma.ageGroup.findMany({ select: { id: true, name: true } }),
    prisma.condition.findMany({ select: { id: true, name: true } }),
    prisma.medication.findMany({ select: { id: true, name: true } }),
  ]);

  return {
    allInsurances,
    allLocations,
    allAgeGroups,
    allConditions,
    allMedications,
  };
}

export async function updatePsychiatrist(
  id: number,
  data: {
    numPatientsAccepted: number;
    requiresInPersonFirstMeeting: boolean;
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
      numPatientsAccepted: data.numPatientsAccepted,
      requiresInPersonFirstMeeting: data.requiresInPersonFirstMeeting,
      // Update insurances
      insurances: {
        deleteMany: {}, // Remove all existing relationships
        create: data.insurances.map((insuranceId) => ({
          insuranceId,
        })), // Create new relationships
      },
      // Update locations
      locations: {
        deleteMany: {}, // Remove all existing relationships
        create: data.locations.map((locationId) => ({
          locationId,
        })), // Create new relationships
      },
      // Update age groups
      ageGroups: {
        deleteMany: {}, // Remove all existing relationships
        create: data.ageGroups.map((ageGroupId) => ({
          ageGroupId,
        })), // Create new relationships
      },
      // Update condition restrictions
      conditionRestrictions: {
        deleteMany: {}, // Remove all existing relationships
        create: data.conditions.map((conditionId) => ({
          conditionId,
        })), // Create new relationships
      },
      // Update medication restrictions
      medicationRestrictions: {
        deleteMany: {}, // Remove all existing relationships
        create: data.medications.map((medicationId) => ({
          medicationId,
        })), // Create new relationships
      },
    },
  });
}
