import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getInsuranceOptions,
  getLocationOptions,
  getAgeGroupOptions,
  getMedicationOptions,
  getConditionOptions,
  searchPsychiatrists,
} from "~/services/psychiatrists";

// Define types for loader and action data
type LoaderData = {
  insurances: { id: number; name: string }[];
  locations: { id: number; name: string }[];
  ageGroups: { id: number; name: string }[];
  medications: { value: number; label: string }[];
  conditions: { value: number; label: string }[];
};

type ActionData = {
  psychiatrists: {
    id: number;
    firstName: string;
    lastName: string;
    credentials: string;
  }[];
};

// Loader: Fetch options for insurance plans, locations, age groups, medications, and conditions
export const loader: LoaderFunction = async () => {
  const insurances = await getInsuranceOptions();
  const locations = await getLocationOptions();
  const ageGroups = await getAgeGroupOptions();
  const medications = await getMedicationOptions();
  const conditions = await getConditionOptions();

  return json({
    insurances,
    locations,
    ageGroups,
    medications: medications.map((m) => ({ value: m.id, label: m.name })),
    conditions: conditions.map((c) => ({ value: c.id, label: c.name })),
  });
};

// Action: Process the form submission and fetch matching psychiatrists
export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const insuranceId = formData.get("insuranceId");
  const locationId = formData.get("locationId");
  const ageGroupId = formData.get("ageGroupId");
  const medicationIds = formData.getAll("medicationIds").map(Number);
  const conditionIds = formData.getAll("conditionIds").map(Number);
  const preferTelehealth = formData.has("preferTelehealth");

  const psychiatrists = await searchPsychiatrists({
    insuranceId: insuranceId ? Number(insuranceId) : undefined,
    locationId: locationId ? Number(locationId) : undefined,
    ageGroupId: ageGroupId ? Number(ageGroupId) : undefined,
    medicationIds: medicationIds.length > 0 ? medicationIds : undefined,
    conditionIds: conditionIds.length > 0 ? conditionIds : undefined,
    preferTelehealth,
  });

  return json<ActionData>({ psychiatrists });
};

// React Component: Render the form and results
export default function Index() {
  const { insurances, locations, ageGroups, medications, conditions } =
    useLoaderData<LoaderData>();
  const data = useActionData<ActionData>();

  return (
    <div
      className="container-fluid d-flex flex-row p-4"
      style={{ minHeight: "100vh" }}
    >
      {/* Edit Button */}
      <Link
        to="/edit-list"
        className="btn btn-outline-primary position-absolute"
        style={{ top: "20px", right: "20px" }}
      >
        Edit
      </Link>

      {/* Form Section */}
      <div className="flex-grow-1 me-4" style={{ maxWidth: "600px" }}>
        <div className="card p-4 mb-3">
          <h2 className="text-primary mb-3">Filter Psychiatrists</h2>
          <Form method="post">
            {/* Insurance Selection */}
            <div className="mb-3">
              <label className="form-label">Select an Insurance Plan</label>
              <Select
                name="insuranceId"
                options={insurances.map((i) => ({
                  value: i.id,
                  label: i.name,
                }))}
                placeholder="Search for an insurance plan..."
                isSearchable
              />
            </div>

            {/* Location Selection */}
            <div className="mb-3">
              <label className="form-label">Select a Location</label>
              <Select
                name="locationId"
                options={locations.map((l) => ({ value: l.id, label: l.name }))}
                placeholder="Select a location..."
                isSearchable
              />
            </div>

            {/* Age Group Selection */}
            <div className="mb-3">
              <label className="form-label">Select an Age Group</label>
              <Select
                name="ageGroupId"
                options={ageGroups.map((a) => ({ value: a.id, label: a.name }))}
                placeholder="Select an age group..."
                isSearchable
              />
            </div>

            {/* Medication Multi-Select */}
            <div className="mb-3">
              <label className="form-label">Medication Restrictions</label>
              <Select
                name="medicationIds"
                options={medications}
                isMulti
                placeholder="Select restricted medications..."
                closeMenuOnSelect={false}
              />
            </div>

            {/* Condition Multi-Select */}
            <div className="mb-3">
              <label className="form-label">Condition Restrictions</label>
              <Select
                name="conditionIds"
                options={conditions}
                isMulti
                placeholder="Select restricted conditions..."
                closeMenuOnSelect={false}
              />
            </div>

            {/* Telehealth Preference Checkbox */}
            <div className="mb-4 p-3 border rounded bg-light">
              <input
                type="checkbox"
                className="form-check-input me-2"
                name="preferTelehealth"
                id="preferTelehealth"
              />
              <label
                className="form-check-label fw-bold text-primary"
                htmlFor="preferTelehealth"
              >
                Patient prefers first meeting through telehealth
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Search
            </button>
          </Form>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-grow-1" style={{ maxWidth: "500px" }}>
        <div className="card p-4">
          <h5 className="text-success mb-3">Available Psychiatrists</h5>
          {data?.psychiatrists && data.psychiatrists.length > 0 ? (
            <ul className="list-group">
              {data.psychiatrists
                .sort((a, b) => a.id - b.id) // Sort psychiatrists by ID in ascending order
                .map((psychiatrist) => (
                  <li key={psychiatrist.id} className="list-group-item">
                    {psychiatrist.firstName} {psychiatrist.lastName},{" "}
                    {psychiatrist.credentials}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-danger">
              No psychiatrists found for the selected criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
