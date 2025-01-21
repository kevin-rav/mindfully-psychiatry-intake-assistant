// Admin Portal Component
// This file serves as the admin page for managing psychiatrists and associated entities.
// It includes functionality for fetching, creating, updating, and deleting data.

import { redirect, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import ManagePsychiatrists from "~/components/custom/ManagePsychiatrists";
import { getSession } from "~/utils/sessions";
import { Psychiatrist, Entity } from "~/types";
import { LoaderFunction, ActionFunction } from "@remix-run/node";
import {
  updatePsychiatrist,
  createPsychiatrist,
  deletePsychiatrist,
  addEntity,
  deleteEntity,
  getAllPsychiatrists,
  getAllEntities,
} from "~/services/psychiatrists";
import ManageEntities from "~/components/custom/ManageEntities";

// shadcn components
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

type LoaderData = {
  psychiatrists: Psychiatrist[];
  allInsurances: Entity[];
  allLocations: Entity[];
  allAgeGroups: Entity[];
  allConditions: Entity[];
  allMedications: Entity[];
};

// Loader function to authenticate and fetch initial data
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const isAuthenticated = session.get("adminAuthenticated");

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return redirect("/password?redirectTo=/admin");
  }

  // Fetch psychiatrists and associated entities in parallel
  const [psychiatrists, entities] = await Promise.all([
    getAllPsychiatrists(),
    getAllEntities(),
  ]);

  // Return data in JSON format for the component to consume
  return json({
    psychiatrists,
    ...entities,
  });
};

// Helper function to process entity creation
async function processEntityAction(formData: FormData) {
  const name = formData.get("newEntityName") as string;
  const type = formData.get("entityType") as string;

  if (!name || !type) {
    throw new Error("Invalid entity data.");
  }

  await addEntity(type, name);
}

// Helper function to process entity deletion
async function processEntityDeletion(formData: FormData) {
  const id = Number(formData.get("deleteEntityId"));
  const type = formData.get("entityType") as string;

  if (!id || !type) {
    throw new Error("Invalid entity data.");
  }

  await deleteEntity(type, id);
}

// Helper function to process psychiatrist deletion
async function processPsychiatristDeletion(formData: FormData) {
  const psychiatristId = Number(formData.get("deletePsychiatristId"));

  if (!psychiatristId) {
    throw new Error("Invalid psychiatrist ID.");
  }

  await deletePsychiatrist(psychiatristId);
}

// Helper function to create or update psychiatrist data
async function processPsychiatristUpsert(
  formData: FormData,
  isAddingNew: boolean
) {
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    credentials: formData.get("credentials") as string,
    numPatientsAccepted: Number(formData.get("numPatientsAccepted")),
    requiresInPersonFirstMeeting: formData.has("requiresInPersonFirstMeeting"),
    initialApptLength: Number(formData.get("initialApptLength")),
    followUpApptLength: Number(formData.get("followUpApptLength")),
    notes: formData.get("notes") as string,
    insurances: JSON.parse(formData.get("insurances") as string),
    locations: JSON.parse(formData.get("locations") as string),
    ageGroups: JSON.parse(formData.get("ageGroups") as string),
    conditions: JSON.parse(formData.get("conditions") as string),
    medications: JSON.parse(formData.get("medications") as string),
  };

  if (isAddingNew) {
    await createPsychiatrist(data);
  } else {
    const psychiatristId = Number(formData.get("psychiatristId"));
    if (!psychiatristId) {
      throw new Error("Invalid psychiatrist ID.");
    }
    await updatePsychiatrist(psychiatristId, data);
  }
}

// Action function to handle form submissions and data modifications
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  try {
    // Handle entity creation
    if (formData.has("newEntityName") && formData.has("entityType")) {
      await processEntityAction(formData);
      return json({ success: true, message: "Entity added successfully." });
    }

    // Handle entity deletion
    if (formData.has("deleteEntityId") && formData.has("entityType")) {
      await processEntityDeletion(formData);
      return json({ success: true, message: "Entity deleted successfully." });
    }

    // Handle psychiatrist deletion
    if (formData.has("deletePsychiatristId")) {
      await processPsychiatristDeletion(formData);
      return json({
        success: true,
        message: "Psychiatrist deleted successfully.",
      });
    }

    // Handle psychiatrist creation or update
    const isAddingNew = formData.get("isAddingNew") === "true";
    if (
      formData.has("firstName") ||
      formData.has("lastName") ||
      formData.has("psychiatristId")
    ) {
      await processPsychiatristUpsert(formData, isAddingNew);
      return json({
        success: true,
        message: isAddingNew
          ? "Psychiatrist created successfully."
          : "Psychiatrist updated successfully.",
      });
    }

    throw new Error("Invalid action.");
  } catch (error) {
    console.error("Error processing action:", error);

    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 400 }
    );
  }
};

// Main admin page component
export default function AdminLayout() {
  // Load data from loader function
  const {
    psychiatrists,
    allInsurances,
    allLocations,
    allAgeGroups,
    allConditions,
    allMedications,
  } = useLoaderData<LoaderData>();

  // Callback to handle psychiatrist updates
  const onPsychiatristUpdated = () => {
    console.log("Psychiatrist updated!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
        <Link to="/">
          <Button variant="outline">Home</Button>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Manage Psychiatrists Section */}
        <Card className="flex-1">
          <CardContent>
            <ManagePsychiatrists
              psychiatrists={psychiatrists}
              allInsurances={allInsurances}
              allLocations={allLocations}
              allAgeGroups={allAgeGroups}
              allConditions={allConditions}
              allMedications={allMedications}
              onPsychiatristUpdated={onPsychiatristUpdated}
            />
          </CardContent>
        </Card>

        {/* Manage Entities Section */}
        <Card className="flex-1">
          <CardContent>
            <ManageEntities
              insurances={allInsurances}
              locations={allLocations}
              conditions={allConditions}
              medications={allMedications}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
