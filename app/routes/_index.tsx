// Index Page Component
// This file serves as the main page for the psychiatry intake assistant.
// It includes a filter form for user inputs and a results list displaying available psychiatrists.

import { useState } from "react";
import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData, Link } from "@remix-run/react";
import FilterForm from "~/components/custom/FilterForm";
import ResultsList from "~/components/custom/ResultsList";
import { Psychiatrist, Entity } from "~/types";
import {
  getInsuranceOptions,
  getLocationOptions,
  getAgeGroupOptions,
  getMedicationOptions,
  getConditionOptions,
  searchPsychiatrists,
} from "~/services/psychiatrists";

// shadcn components
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

// Fetch initial data for the form
export const loader: LoaderFunction = async () => {
  const insurances = await getInsuranceOptions();
  const locations = await getLocationOptions();
  const ageGroups = await getAgeGroupOptions();
  const medications = await getMedicationOptions();
  const conditions = await getConditionOptions();

  return json({ insurances, locations, ageGroups, medications, conditions });
};

// Handle form submission and return filtered psychiatrist data
export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());

  // Extract filter values from form data
  const filters = {
    insuranceId: formData.get("insuranceId")
      ? Number(formData.get("insuranceId"))
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

  // Fetch psychiatrists based on the filters and sort by ID
  const psychiatrists = await searchPsychiatrists(filters);
  return json({ psychiatrists: psychiatrists.sort((a, b) => a.id - b.id) });
};

// Main page component
export default function Index() {
  // Load initial data and action data
  const { insurances, locations, ageGroups, medications, conditions } =
    useLoaderData<{
      insurances: Entity[];
      locations: Entity[];
      ageGroups: Entity[];
      medications: Entity[];
      conditions: Entity[];
    }>();
  const data = useActionData<{ psychiatrists: Psychiatrist[] }>();

  // State to manage selected filters
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
      {/* Filter Form Section */}

      {/* Results List Section */}

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
