import { prisma } from "~/utils/prisma.server";

export async function getInsuranceOptions() {
    return prisma.insurance.findMany();
  }
  
  export async function getLocationOptions() {
    return prisma.location.findMany();
  }
  
  export async function getAgeGroupOptions() {
    return prisma.ageGroup.findMany();
  }
  
  export async function getMedicationOptions() {
    return prisma.medication.findMany();
  }
  
  export async function getConditionOptions() {
    return prisma.condition.findMany();
  }
  

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

export async function updateEntity(type: string, id: number, name: string) {
  switch (type) {
    case "insurance":
      return prisma.insurance.update({ where: { id }, data: { name } });
    case "location":
      return prisma.location.update({ where: { id }, data: { name } });
    case "condition":
      return prisma.condition.update({ where: { id }, data: { name } });
    case "medication":
      return prisma.medication.update({ where: { id }, data: { name } });
    default:
      throw new Error(`Unknown entity type: ${type}`);
  }
}

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
