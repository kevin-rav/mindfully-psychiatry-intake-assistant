export type Psychiatrist = {
  id: number;
  firstName: string;
  lastName: string;
  credentials: string;
  numPatientsAccepted: number;
  requiresInPersonFirstMeeting: boolean;
  initialApptLength: number;
  followUpApptLength: number;
  notes: string;
  insurances: { insuranceId: number }[];
  locations: { locationId: number }[];
  ageGroups: { ageGroupId: number }[];
  conditionRestrictions: { conditionId: number }[];
  medicationRestrictions: { medicationId: number }[];
};

export type Entity = {
  id: number;
  name: string;
};
