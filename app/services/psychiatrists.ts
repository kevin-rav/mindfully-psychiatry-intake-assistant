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
      initialApptLength: data.initialApptLength, // Update initial appointment length
      followUpApptLength: data.followUpApptLength, // Update follow-up appointment length
      notes: data.notes, // Update notes
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

// Add a new entity to a specified table
export async function addEntity(type: string, name: string) {
  switch (type) {
    case "insurance":
      return prisma.insurance.create({
        data: { name },
      });
    case "location":
      return prisma.location.create({
        data: { name },
      });
    case "condition":
      return prisma.condition.create({
        data: { name },
      });
    case "medication":
      return prisma.medication.create({
        data: { name },
      });
    default:
      throw new Error(`Unknown entity type: ${type}`);
  }
}

// Delete an entity from a specified table
export async function deleteEntity(type: string, id: number) {
  switch (type) {
    case "insurance":
      return prisma.insurance.delete({
        where: { id },
      });
    case "location":
      return prisma.location.delete({
        where: { id },
      });
    case "condition":
      return prisma.condition.delete({
        where: { id },
      });
    case "medication":
      return prisma.medication.delete({
        where: { id },
      });
    default:
      throw new Error(`Unknown entity type: ${type}`);
  }
}

// Fetch all psychiatrists with selected fields
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

