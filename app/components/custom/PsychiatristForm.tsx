// PsychiatristForm Component
// This component provides a form for adding or editing psychiatrist information.

import { Form, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { Psychiatrist, Entity } from "~/types";

// shadcn components
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import CheckboxGroup from "~/components/ui/checkbox-group";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

// Props for the form, including the optional psychiatrist for editing mode
type PsychiatristFormProps = {
  psychiatrist?: Psychiatrist; // If provided, the form is in "edit" mode
  allInsurances: Entity[]; // List of all available insurances
  allLocations: Entity[]; // List of all available locations
  allAgeGroups: Entity[]; // List of all available age groups
  allConditions: Entity[]; // List of all available conditions
  allMedications: Entity[]; // List of all available medications
  onSuccess: () => void; // Callback function after successful form submission
};

export default function PsychiatristForm({
  psychiatrist,
  allInsurances,
  allLocations,
  allAgeGroups,
  allConditions,
  allMedications,
  onSuccess,
}: PsychiatristFormProps) {
  const submit = useSubmit();

  // Determine whether this is an edit or add operation
  const isEditing = Boolean(psychiatrist);

  // State for form fields
  const [firstName, setFirstName] = useState(psychiatrist?.firstName || "");
  const [lastName, setLastName] = useState(psychiatrist?.lastName || "");
  const [credentials, setCredentials] = useState(
    psychiatrist?.credentials || ""
  );
  const [notes, setNotes] = useState(psychiatrist?.notes || "");
  const [initialApptLength, setInitialApptLength] = useState(
    String(psychiatrist?.initialApptLength || "")
  );
  const [followUpApptLength, setFollowUpApptLength] = useState(
    String(psychiatrist?.followUpApptLength || "")
  );
  const [numPatientsAccepted, setNumPatientsAccepted] = useState<number | "">(
    psychiatrist?.numPatientsAccepted || ""
  );
  const [requiresInPersonFirstMeeting, setRequiresInPersonFirstMeeting] =
    useState(psychiatrist?.requiresInPersonFirstMeeting || false);

  const [selectedInsurances, setSelectedInsurances] = useState<number[]>(
    psychiatrist?.insurances.map((i) => i.insuranceId) || []
  );
  const [selectedLocations, setSelectedLocations] = useState<number[]>(
    psychiatrist?.locations.map((l) => l.locationId) || []
  );
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<number[]>(
    psychiatrist?.ageGroups.map((a) => a.ageGroupId) || []
  );
  const [selectedConditions, setSelectedConditions] = useState<number[]>(
    psychiatrist?.conditionRestrictions.map((c) => c.conditionId) || []
  );
  const [selectedMedications, setSelectedMedications] = useState<number[]>(
    psychiatrist?.medicationRestrictions.map((m) => m.medicationId) || []
  );

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Collect form data for submission
    const formData = new FormData(event.currentTarget);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("credentials", credentials);
    formData.append("notes", notes);
    formData.append("initialApptLength", initialApptLength);
    formData.append("followUpApptLength", followUpApptLength);
    formData.append("numPatientsAccepted", String(numPatientsAccepted));
    formData.append(
      "requiresInPersonFirstMeeting",
      String(requiresInPersonFirstMeeting)
    );
    formData.append("insurances", JSON.stringify(selectedInsurances));
    formData.append("locations", JSON.stringify(selectedLocations));
    formData.append("ageGroups", JSON.stringify(selectedAgeGroups));
    formData.append("conditions", JSON.stringify(selectedConditions));
    formData.append("medications", JSON.stringify(selectedMedications));

    // Add specific fields for editing or adding a new psychiatrist
    if (isEditing) {
      formData.append("psychiatristId", String(psychiatrist?.id));
    } else {
      formData.append("isAddingNew", "true");
    }

    // Submit the form data
    submit(formData, { method: "post" });
    onSuccess();
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">
        {isEditing
          ? `Edit Provider ${psychiatrist?.firstName} ${psychiatrist?.lastName}`
          : "Add New Provider"}
      </h2>

      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      {/* Credentials */}
      <div className="space-y-2">
        <Label>Credentials</Label>
        <RadioGroup
          name="credentials"
          value={credentials}
          onValueChange={(value) => {
            setCredentials(value); // Update state
          }}
          className="flex space-x-4"
        >
          {["MD", "DO", "NP", "PhD/NP"].map((cred) => (
            <div key={cred} className="flex items-center space-x-2">
              <RadioGroupItem value={cred} id={`credential-${cred}`} />
              <Label htmlFor={`credential-${cred}`}>{cred}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Appointment Lengths */}
      <div className="space-y-2">
        <Label>Initial Appointment Length (minutes)</Label>
        <RadioGroup
          name="initialApptLength"
          value={initialApptLength}
          onValueChange={setInitialApptLength}
          className="flex space-x-4"
        >
          {[15, 30, 45, 60, 90].map((length) => (
            <div key={length} className="flex items-center space-x-2">
              <RadioGroupItem value={String(length)} id={`initial-${length}`} />
              <Label htmlFor={`initial-${length}`}>{length} minutes</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Follow-Up Appointment Length */}
      <div className="space-y-2">
        <Label>Follow-Up Appointment Length (minutes)</Label>
        <RadioGroup
          name="followUpApptLength"
          value={followUpApptLength}
          onValueChange={setFollowUpApptLength}
          className="flex space-x-4"
        >
          {[15, 30, 45, 60].map((length) => (
            <div key={length} className="flex items-center space-x-2">
              <RadioGroupItem
                value={String(length)}
                id={`followup-${length}`}
              />
              <Label htmlFor={`followup-${length}`}>{length} minutes</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Number of Patients */}
      <div className="space-y-2">
        <Label htmlFor="numPatientsAccepted">Number of Patients Accepted</Label>
        <Input
          id="numPatientsAccepted"
          name="numPatientsAccepted"
          type="number"
          value={numPatientsAccepted}
          onChange={(e) =>
            setNumPatientsAccepted(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
      </div>

      {/* Telehealth Checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="requiresInPersonFirstMeeting"
          name="requiresInPersonFirstMeeting"
          checked={requiresInPersonFirstMeeting}
          onCheckedChange={(checked) =>
            setRequiresInPersonFirstMeeting(!!checked)
          }
        />
        <Label htmlFor="requiresInPersonFirstMeeting">
          Requires In-Person First Meeting
        </Label>
      </div>

      {/* Multi-Select Fields */}
      <div className="flex flex-wrap gap-6">
        {/* Left Column: Insurances */}
        <div className="flex-1 min-w-[300px]">
          <CheckboxGroup
            label="Insurances"
            items={allInsurances}
            selectedItems={selectedInsurances}
            setSelectedItems={setSelectedInsurances}
          />
        </div>

        {/* Right Column: Other Fields */}
        <div className="flex-1 min-w-[300px] space-y-4">
          <CheckboxGroup
            label="Locations"
            items={allLocations}
            selectedItems={selectedLocations}
            setSelectedItems={setSelectedLocations}
          />
          <CheckboxGroup
            label="Age Groups"
            items={allAgeGroups}
            selectedItems={selectedAgeGroups}
            setSelectedItems={setSelectedAgeGroups}
          />
          <CheckboxGroup
            label="Condition Restrictions"
            items={allConditions}
            selectedItems={selectedConditions}
            setSelectedItems={setSelectedConditions}
          />
          <CheckboxGroup
            label="Medication Restrictions"
            items={allMedications}
            selectedItems={selectedMedications}
            setSelectedItems={setSelectedMedications}
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit">
        {isEditing ? "Save Changes" : "Add Provider"}
      </Button>
    </Form>
  );
}
