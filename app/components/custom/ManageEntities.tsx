import React, { useState } from "react";
import { Form } from "@remix-run/react";
import { Entity } from "~/types";
import FormHeader from "~/components/shared/FormHeader";
import TableWithActions from "~/components/shared/TableWithActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

type EntityType = "insurance" | "location" | "condition" | "medication";

interface ManageEntitiesProps {
  insurances: Entity[];
  locations: Entity[];
  conditions: Entity[];
  medications: Entity[];
  onEntitiesUpdated: () => void;
}

export default function ManageEntities({
  insurances,
  locations,
  conditions,
  medications,
  onEntitiesUpdated,
}: ManageEntitiesProps) {
  const [entities, setEntities] = useState({
    insurance: insurances,
    location: locations,
    condition: conditions,
    medication: medications,
  });

  const [activeTab, setActiveTab] = useState<EntityType>("insurance");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [entityInput, setEntityInput] = useState("");

  const handleAddClick = () => {
    setSelectedEntity(null);
    setEntityInput("");
    setIsDialogOpen(true);
  };

  const handleEditClick = (entity: Entity) => {
    setSelectedEntity(entity);
    setEntityInput(entity.name);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (entity: Entity) => {
    setSelectedEntity(entity);
    setIsDeleteOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setIsDeleteOpen(false);
    onEntitiesUpdated();
  };

  return (
    <div className="p-6">
      <FormHeader
        title="Manage Entities"
        description="Manage and edit the list of filtering criteria."
        buttonText={`Add ${activeTab}`}
        onButtonClick={handleAddClick}
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as EntityType)}
      >
        <TabsList>
          <TabsTrigger value="insurance">Insurances</TabsTrigger>
          <TabsTrigger value="location">Locations</TabsTrigger>
          <TabsTrigger value="condition">Conditions</TabsTrigger>
          <TabsTrigger value="medication">Medications</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <TableWithActions
            data={entities[activeTab]}
            columns={[{ label: "Name", accessor: "name" }]}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEntity
                ? `Edit ${selectedEntity.name}`
                : `Add New ${activeTab}`}
            </DialogTitle>
          </DialogHeader>
          <Form method="post" onSubmit={handleSuccess}>
            <Input
              name="entityName"
              value={entityInput}
              onChange={(e) => setEntityInput(e.target.value)}
              placeholder={`Enter ${activeTab} name`}
              required
            />
            <input type="hidden" name="entityType" value={activeTab} />
            {selectedEntity && (
              <input type="hidden" name="entityId" value={selectedEntity.id} />
            )}
            <input
              type="hidden"
              name="isAddingNew"
              value={selectedEntity ? "false" : "true"}
            />

            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedEntity ? "Save Changes" : "Add"}
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>

      {selectedEntity && (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <div className="p-4">
              <h2 className="text-lg font-bold">
                Confirm Deletion of {selectedEntity.name}
              </h2>
              <p>Are you sure you want to delete this entity?</p>
              <div className="flex justify-end mt-4 space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Form method="post" onSubmit={handleSuccess}>
                  <input
                    type="hidden"
                    name="deleteEntityId"
                    value={selectedEntity.id}
                  />
                  <input type="hidden" name="entityType" value={activeTab} />
                  <Button type="submit" variant="destructive">
                    Delete
                  </Button>
                </Form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
