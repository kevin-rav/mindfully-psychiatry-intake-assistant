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
}

export default function ManageEntities({
  insurances,
  locations,
  conditions,
  medications,
}: ManageEntitiesProps) {
  const [entities, setEntities] = useState({
    insurance: insurances,
    location: locations,
    condition: conditions,
    medication: medications,
  });
  const [activeTab, setActiveTab] = useState<EntityType>("insurance");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"add" | "delete">("add");
  const [entityInput, setEntityInput] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const handleAdd = () => {
    setDialogType("add");
    setIsDialogOpen(true);
  };

  const handleDelete = (entity: Entity) => {
    setSelectedEntity(entity);
    setDialogType("delete");
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dialogType === "add") {
      const newEntity = { id: Date.now(), name: entityInput };
      setEntities((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newEntity],
      }));
    } else if (dialogType === "delete" && selectedEntity) {
      setEntities((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((e) => e.id !== selectedEntity.id),
      }));
    }
    setIsDialogOpen(false);
    setEntityInput("");
    setSelectedEntity(null);
  };

  return (
    <div className="p-6">
      <FormHeader
        title="Manage Entities"
        description="Manage and edit the list of filtering criteria."
        buttonText={`Add ${activeTab}`}
        onButtonClick={handleAdd}
      />

      {/* Tabs Section */}
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
        <TabsContent value="insurance">
          <TableWithActions
            data={entities.insurance}
            columns={[{ label: "Name", accessor: "name" }]}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="location">
          <TableWithActions
            data={entities.location}
            columns={[{ label: "Name", accessor: "name" }]}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="condition">
          <TableWithActions
            data={entities.condition}
            columns={[{ label: "Name", accessor: "name" }]}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="medication">
          <TableWithActions
            data={entities.medication}
            columns={[{ label: "Name", accessor: "name" }]}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog Section */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "add"
                ? `Add New ${activeTab}`
                : `Delete ${selectedEntity?.name}`}
            </DialogTitle>
          </DialogHeader>
          <Form onSubmit={handleSubmit}>
            {dialogType === "add" ? (
              <Input
                name="entityName"
                value={entityInput}
                onChange={(e) => setEntityInput(e.target.value)}
                placeholder={`Enter ${activeTab} name`}
              />
            ) : (
              <p>Are you sure you want to delete {selectedEntity?.name}?</p>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant={dialogType === "add" ? "default" : "destructive"}
              >
                {dialogType === "add" ? "Add" : "Delete"}
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
