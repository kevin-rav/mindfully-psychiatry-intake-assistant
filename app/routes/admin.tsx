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
  getAllPsychiatrists,
} from "~/services/psychiatristServices";
import {
  addEntity,
  deleteEntity,
  getAllEntities,
} from "~/services/entityServices";
import ManageEntities from "~/components/custom/ManageEntities";
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

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const isAuthenticated = session.get("adminAuthenticated");

  if (!isAuthenticated) {
    return redirect("/password?redirectTo=/admin");
  }

  const [psychiatrists, entities] = await Promise.all([
    getAllPsychiatrists(),
    getAllEntities(),
  ]);

  return json({
    psychiatrists,
    ...entities,
  });
};

async function processEntityAction(formData: FormData) {
  const name = formData.get("newEntityName") as string;
  const type = formData.get("entityType") as string;

  if (!name || !type) {
    throw new Error("Invalid entity data.");
  }

  await addEntity(type, name);
}

async function processEntityDeletion(formData: FormData) {
  const id = Number(formData.get("deleteEntityId"));
  const type = formData.get("entityType") as string;

  if (!id || !type) {
    throw new Error("Invalid entity data.");
  }

  await deleteEntity(type, id);
}

async function processPsychiatristDeletion(formData: FormData) {
  const psychiatristId = Number(formData.get("deletePsychiatristId"));

  if (!psychiatristId) {
    throw new Error("Invalid psychiatrist ID.");
  }

  await deletePsychiatrist(psychiatristId);
}

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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  try {
    if (formData.has("newEntityName") && formData.has("entityType")) {
      await processEntityAction(formData);
      return json({ success: true, message: "Entity added successfully." });
    }

    if (formData.has("deleteEntityId") && formData.has("entityType")) {
      await processEntityDeletion(formData);
      return json({ success: true, message: "Entity deleted successfully." });
    }

    if (formData.has("deletePsychiatristId")) {
      await processPsychiatristDeletion(formData);
      return json({
        success: true,
        message: "Psychiatrist deleted successfully.",
      });
    }

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

export default function AdminLayout() {
  const {
    psychiatrists,
    allInsurances,
    allLocations,
    allAgeGroups,
    allConditions,
    allMedications,
  } = useLoaderData<LoaderData>();

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
