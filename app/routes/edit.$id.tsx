import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData, Link } from "@remix-run/react";
import {
  getPsychiatristWithDetails,
  getAllEntities,
  updatePsychiatrist,
} from "~/services/psychiatrists";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

type LoaderData = {
  psychiatrist: Awaited<ReturnType<typeof getPsychiatristWithDetails>>;
  allInsurances: { id: number; name: string }[];
  allLocations: { id: number; name: string }[];
  allAgeGroups: { id: number; name: string }[];
  allConditions: { id: number; name: string }[];
  allMedications: { id: number; name: string }[];
};

type ActionData = {
  success: boolean;
};

export const loader: LoaderFunction = async ({ params }) => {
  const psychiatristId = Number(params.id);
  const psychiatrist = await getPsychiatristWithDetails(psychiatristId);

  if (!psychiatrist) {
    throw new Response("Psychiatrist not found", { status: 404 });
  }

  const entities = await getAllEntities();

  return json<LoaderData>({ psychiatrist, ...entities });
};

export const action: ActionFunction = async ({ request, params }) => {
  const psychiatristId = Number(params.id);
  const formData = await request.formData();

  const numPatientsAccepted = Number(formData.get("numPatientsAccepted"));
  const requiresInPersonFirstMeeting = formData.has(
    "requiresInPersonFirstMeeting"
  );
  const insurances = formData.getAll("insurances").map(Number);
  const locations = formData.getAll("locations").map(Number);
  const ageGroups = formData.getAll("ageGroups").map(Number);
  const conditions = formData.getAll("conditions").map(Number);
  const medications = formData.getAll("medications").map(Number);

  await updatePsychiatrist(psychiatristId, {
    numPatientsAccepted,
    requiresInPersonFirstMeeting,
    insurances,
    locations,
    ageGroups,
    conditions,
    medications,
  });

  return json<ActionData>({ success: true });
};

export default function EditPsychiatrist() {
  const {
    psychiatrist,
    allInsurances,
    allLocations,
    allAgeGroups,
    allConditions,
    allMedications,
  } = useLoaderData<LoaderData>();

  const actionData = useActionData<ActionData>();

  const [notificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    if (actionData?.success) {
      setNotificationVisible(true);
      const timer = setTimeout(() => {
        setNotificationVisible(false);
      }, 3000); // Hide notification after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  return (
    <div className="container" style={{ padding: "2rem" }}>
      {/* Home Button */}
      <Link
        to="/"
        className="btn btn-outline-secondary position-absolute"
        style={{ top: "20px", right: "20px" }}
      >
        Home
      </Link>

      <h1>
        Edit {psychiatrist?.firstName} {psychiatrist?.lastName}
      </h1>

      {/* Notification */}
      {notificationVisible && (
        <div className="alert alert-success" role="alert">
          Changes saved successfully!
        </div>
      )}

      <Form method="post">
        {/* Number of Patients */}
        <div className="mb-3">
          <label htmlFor="numPatientsAccepted" className="form-label">
            Number of Patients Accepted
          </label>
          <input
            type="number"
            name="numPatientsAccepted"
            id="numPatientsAccepted"
            className="form-control"
            defaultValue={psychiatrist?.numPatientsAccepted}
          />
        </div>

        {/* Telehealth Preference */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="requiresInPersonFirstMeeting"
            id="requiresInPersonFirstMeeting"
            className="form-check-input"
            defaultChecked={!psychiatrist?.requiresInPersonFirstMeeting}
          />
          <label
            htmlFor="requiresInPersonFirstMeeting"
            className="form-check-label"
          >
            Allow Telehealth for First Meeting
          </label>
        </div>

        {/* Dynamic Sections for Relationships */}
        {[
          {
            label: "Insurances",
            name: "insurances",
            items: allInsurances,
            current: psychiatrist?.insurances ?? [],
          },
          {
            label: "Locations",
            name: "locations",
            items: allLocations,
            current: psychiatrist?.locations ?? [],
          },
          {
            label: "Age Groups",
            name: "ageGroups",
            items: allAgeGroups,
            current: psychiatrist?.ageGroups ?? [],
          },
          {
            label: "Condition Restrictions",
            name: "conditions",
            items: allConditions,
            current: psychiatrist?.conditionRestrictions ?? [],
          },
          {
            label: "Medication Restrictions",
            name: "medications",
            items: allMedications,
            current: psychiatrist?.medicationRestrictions ?? [],
          },
        ].map(({ label, name, items, current }) => (
          <div className="mb-3" key={name}>
            <label className="form-label">{label}</label>
            {items.map((item) => (
              <div key={item.id} className="form-check">
                <input
                  type="checkbox"
                  name={name}
                  value={item.id}
                  className="form-check-input"
                  defaultChecked={current.some(
                    (c: any) => c[name.slice(0, -1) + "Id"] === item.id
                  )}
                />
                <label className="form-check-label">{item.name}</label>
              </div>
            ))}
          </div>
        ))}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </Form>
    </div>
  );
}
