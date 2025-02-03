import { redirect, json } from "@remix-run/node";
import { Link, useLoaderData, Form } from "@remix-run/react";
import ManagePsychiatrists from "~/components/custom/ManagePsychiatrists";
import ManageEntities from "~/components/custom/ManageEntities";
import { getSession } from "~/utils/sessions";
import {
  addEntity,
  deleteEntity,
  updateEntity,
  getAllEntities,
} from "~/services/entityServices";
import {
  updatePsychiatrist,
  createPsychiatrist,
  deletePsychiatrist,
  getAllPsychiatrists,
} from "~/services/psychiatristServices";
import { Psychiatrist, Entity } from "~/types";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const isAuthenticated = session.get("adminAuthenticated");

  if (!isAuthenticated) {
    return redirect("/password?redirectTo=/admin");
  }

  const [psychiatrists, entities] = await Promise.all([
    getAllPsychiatrists(),
    getAllEntities(),
  ]);

  return json({ psychiatrists, ...entities });
};

async function processPsychiatristUpsert(formData, isAddingNew) {
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    credentials: formData.get("credentials"),
    numPatientsAccepted: Number(formData.get("numPatientsAccepted")),
    requiresInPersonFirstMeeting: formData.has("requiresInPersonFirstMeeting"),
    initialApptLength: Number(formData.get("initialApptLength")),
    followUpApptLength: Number(formData.get("followUpApptLength")),
    notes: formData.get("notes"),
    insurances: JSON.parse(formData.get("insurances")),
    locations: JSON.parse(formData.get("locations")),
    ageGroups: JSON.parse(formData.get("ageGroups")),
    conditions: JSON.parse(formData.get("conditions")),
    medications: JSON.parse(formData.get("medications")),
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

async function processPsychiatristDeletion(formData) {
  const psychiatristId = Number(formData.get("deletePsychiatristId"));
  if (!psychiatristId) {
    throw new Error("Invalid psychiatrist ID.");
  }
  await deletePsychiatrist(psychiatristId);
}

async function processEntityUpsert(formData, isAddingNew) {
  const name = formData.get("entityName");
  const type = formData.get("entityType");

  if (!name || !type) {
    throw new Error("Invalid entity data.");
  }

  if (isAddingNew) {
    const newEntity = await addEntity(type, name);
    return newEntity;
  } else {
    const entityId = Number(formData.get("entityId"));
    if (!entityId) {
      throw new Error("Invalid entity ID.");
    }
    const updatedEntity = await updateEntity(type, entityId, name);
    return updatedEntity;
  }
}

async function processEntityDeletion(formData) {
  const id = Number(formData.get("deleteEntityId"));
  const type = formData.get("entityType");

  if (!id || !type) {
    throw new Error("Invalid entity data.");
  }

  await deleteEntity(type, id);
}

export const action = async ({ request }) => {
  const formData = await request.formData();

  try {
    if (
      formData.has("firstName") ||
      formData.has("lastName") ||
      formData.has("psychiatristId")
    ) {
      const isAddingNew = formData.get("isAddingNew") === "true";
      await processPsychiatristUpsert(formData, isAddingNew);
      return json({
        success: true,
        message: isAddingNew
          ? "Psychiatrist created successfully."
          : "Psychiatrist updated successfully.",
      });
    }

    if (formData.has("deletePsychiatristId")) {
      await processPsychiatristDeletion(formData);
      return json({
        success: true,
        message: "Psychiatrist deleted successfully.",
      });
    }

    if (formData.has("entityName") && formData.has("entityType")) {
      const isAddingNew = formData.get("isAddingNew") === "true";
      const entity = await processEntityUpsert(formData, isAddingNew);
      return json({
        success: true,
        message: isAddingNew
          ? "Entity added successfully."
          : "Entity updated successfully.",
        entity,
      });
    }

    if (formData.has("deleteEntityId") && formData.has("entityType")) {
      await processEntityDeletion(formData);
      return json({ success: true, message: "Entity deleted successfully." });
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
  } = useLoaderData();

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
