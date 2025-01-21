// FilterForm Component
// This component renders a form allowing users to filter psychiatrists based on various criteria.

import React from "react";
import { Form } from "@remix-run/react";
import { Entity } from "~/types";
import FormHeader from "~/components/shared/FormHeader";
import SelectField from "~/components/shared/SelectField";

// shadcn components
import { MultiSelect } from "~/components/ui/multi-select";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";

// Props for the FilterForm component
interface FilterFormProps {
  insurances: Entity[]; // List of insurance options for filtering
  locations: Entity[]; // List of location options for filtering
  ageGroups: Entity[]; // List of age groups for filtering
  medications: Entity[]; // List of medications for filtering by restrictions
  conditions: Entity[]; // List of conditions for filtering by restrictions
  medicationIds: number[]; // Selected medication IDs
  setMedicationIds: React.Dispatch<React.SetStateAction<number[]>>; // Setter for medication IDs
  conditionIds: number[]; // Selected condition IDs
  setConditionIds: React.Dispatch<React.SetStateAction<number[]>>; // Setter for condition IDs
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
        {/* Insurance Select Field */}
        <SelectField
          label="Select an Insurance Plan"
          name="insuranceId"
          options={insurances}
          placeholder="Select an insurance plan"
        />

        {/* Location Select Field */}
        <SelectField
          label="Select a Location"
          name="locationId"
          options={locations}
          placeholder="Select a location"
        />

        {/* Age Group Select Field */}
        <SelectField
          label="Select an Age Group"
          name="ageGroupId"
          options={ageGroups}
          placeholder="Select an age group"
        />

        {/* Medication Multi-Select */}
        <MultiSelect
          label="Medication Restrictions"
          options={medications}
          selectedValues={medicationIds}
          onChange={setMedicationIds}
        />

        {/* Condition Multi-Select */}
        <MultiSelect
          label="Condition Restrictions"
          options={conditions}
          selectedValues={conditionIds}
          onChange={setConditionIds}
        />

        {/* Telehealth Preference Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox id="preferTelehealth" name="preferTelehealth" />
          <label htmlFor="preferTelehealth" className="text-sm">
            Patient prefers first meeting through telehealth
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Search
        </Button>
      </Form>
    </div>
  );
}
