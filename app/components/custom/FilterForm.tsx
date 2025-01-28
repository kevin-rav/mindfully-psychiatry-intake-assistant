import React from "react";
import { Form } from "@remix-run/react";
import { Entity } from "~/types";
import FormHeader from "~/components/shared/FormHeader";
import SelectField from "~/components/shared/SelectField";
import { MultiSelect } from "~/components/ui/multi-select";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";

interface FilterFormProps {
  insurances: Entity[];
  locations: Entity[];
  ageGroups: Entity[];
  medications: Entity[];
  conditions: Entity[];
  medicationIds: number[];
  setMedicationIds: React.Dispatch<React.SetStateAction<number[]>>;
  conditionIds: number[];
  setConditionIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function FilterForm({
  insurances,
  locations,
  ageGroups,
  medications,
  conditions,
  medicationIds,
  setMedicationIds,
  conditionIds,
  setConditionIds,
}: FilterFormProps) {
  return (
    <div className="p-6">
      <FormHeader
        title="Filter Psychiatrists"
        description="Fill out the form to find psychiatrists that match your preferences."
      />

      <Form method="post" className="space-y-4">
        <SelectField
          label="Select an Insurance Plan"
          name="insuranceId"
          options={insurances}
          placeholder="Select an insurance plan"
        />

        <SelectField
          label="Select a Secondary Insurance Plan"
          name="insuranceId2"
          options={insurances}
          placeholder="Select a secondary insurance plan (optional)"
        />

        <SelectField
          label="Select a Location"
          name="locationId"
          options={locations}
          placeholder="Select a location"
        />

        <SelectField
          label="Select an Age Group"
          name="ageGroupId"
          options={ageGroups}
          placeholder="Select an age group"
        />

        <MultiSelect
          label="Medication Restrictions"
          options={medications}
          selectedValues={medicationIds}
          onChange={setMedicationIds}
        />

        <MultiSelect
          label="Condition Restrictions"
          options={conditions}
          selectedValues={conditionIds}
          onChange={setConditionIds}
        />

        <div className="flex items-center gap-2">
          <Checkbox id="preferTelehealth" name="preferTelehealth" />
          <label htmlFor="preferTelehealth" className="text-sm">
            Patient prefers first meeting through telehealth
          </label>
        </div>

        <Button type="submit" className="w-full">
          Search
        </Button>
      </Form>
    </div>
  );
}
