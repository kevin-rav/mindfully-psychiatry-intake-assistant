import { useState } from "react";
import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData, Link } from "@remix-run/react";
import FilterForm from "~/components/custom/FilterForm";
import ResultsList from "~/components/custom/ResultsList";
import { Psychiatrist, Entity } from "~/types";
import { searchPsychiatrists } from "~/services/psychiatristServices";
import {
  getInsuranceOptions,
  getLocationOptions,
  getAgeGroupOptions,
  getMedicationOptions,
  getConditionOptions,
} from "~/services/entityServices";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export const loader: LoaderFunction = async () => {
  const insurances = await getInsuranceOptions();
  const locations = await getLocationOptions();
  const ageGroups = await getAgeGroupOptions();
  const medications = await getMedicationOptions();
  const conditions = await getConditionOptions();

  return json({ insurances, locations, ageGroups, medications, conditions });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());

  const filters = {
    insuranceId: formData.get("insuranceId")
      ? Number(formData.get("insuranceId"))
      : undefined,
    insuranceId2: formData.get("insuranceId2")
      ? Number(formData.get("insuranceId2"))
      : undefined,
    locationId: formData.get("locationId")
      ? Number(formData.get("locationId"))
      : undefined,
    ageGroupId: formData.get("ageGroupId")
      ? Number(formData.get("ageGroupId"))
      : undefined,
    medicationIds: formData.getAll("medicationIds").map(Number),
    conditionIds: formData.getAll("conditionIds").map(Number),
    preferTelehealth: formData.has("preferTelehealth"),
  };

  const psychiatrists = await searchPsychiatrists(filters);
  return json({ psychiatrists: psychiatrists.sort((a, b) => a.id - b.id) });
};

export default function Index() {
  const { insurances, locations, ageGroups, medications, conditions } =
    useLoaderData<{
      insurances: Entity[];
      locations: Entity[];
      ageGroups: Entity[];
      medications: Entity[];
      conditions: Entity[];
    }>();
  const data = useActionData<{ psychiatrists: Psychiatrist[] }>();

  const [medicationIds, setMedicationIds] = useState<number[]>([]);
  const [conditionIds, setConditionIds] = useState<number[]>([]);
  const [selectedPsychiatrist, setSelectedPsychiatrist] =
    useState<Psychiatrist | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Mindfully Psychiatry Intake Assistant
        </h1>
        <Link to="/admin">
          <Button variant="outline">Admin Portal</Button>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-6"></div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1">
          <CardContent>
            <FilterForm
              insurances={insurances}
              locations={locations}
              ageGroups={ageGroups}
              medications={medications}
              conditions={conditions}
              medicationIds={medicationIds}
              setMedicationIds={setMedicationIds}
              conditionIds={conditionIds}
              setConditionIds={setConditionIds}
            />
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent>
            <ResultsList
              psychiatrists={data?.psychiatrists}
              selectedPsychiatrist={selectedPsychiatrist}
              setSelectedPsychiatrist={setSelectedPsychiatrist}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
