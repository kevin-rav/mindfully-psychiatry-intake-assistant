import { useState } from "react";
import { Form } from "@remix-run/react";
import PsychiatristForm from "~/components/custom/PsychiatristForm";
import TableWithActions from "~/components/shared/TableWithActions";
import { Psychiatrist, Entity } from "~/types";
import FormHeader from "~/components/shared/FormHeader";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

type ManagePsychiatristsProps = {
  psychiatrists: Psychiatrist[];
  allInsurances: Entity[];
  allLocations: Entity[];
  allAgeGroups: Entity[];
  allConditions: Entity[];
  allMedications: Entity[];
  onPsychiatristUpdated: () => void;
};

export default function ManagePsychiatrists({
  psychiatrists,
  allInsurances,
  allLocations,
  allAgeGroups,
  allConditions,
  allMedications,
  onPsychiatristUpdated,
}: ManagePsychiatristsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPsychiatrist, setSelectedPsychiatrist] =
    useState<Psychiatrist | null>(null);

  const handleAddClick = () => {
    setSelectedPsychiatrist(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (psychiatrist: Psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (psychiatrist: Psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist);
    setIsDeleteOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setIsDeleteOpen(false);
    onPsychiatristUpdated();
  };

  return (
    <div className="p-6">
      <FormHeader
        title="Manage Providers"
        description="Manage and edit the list of providers."
        buttonText="Add Provider"
        onButtonClick={handleAddClick}
      />

      <TableWithActions
        data={psychiatrists}
        columns={[
          { label: "First Name", accessor: "firstName" },
          { label: "Last Name", accessor: "lastName" },
        ]}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl w-full h-5/6 bg-gray-50 overflow-hidden">
          <div className="overflow-y-auto p-6">
            <PsychiatristForm
              psychiatrist={selectedPsychiatrist || undefined}
              allInsurances={allInsurances}
              allLocations={allLocations}
              allAgeGroups={allAgeGroups}
              allConditions={allConditions}
              allMedications={allMedications}
              onSuccess={handleSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>

      {selectedPsychiatrist && (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-md">
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-bold">
                Confirm Deletion of {selectedPsychiatrist.firstName}{" "}
                {selectedPsychiatrist.lastName}
              </h2>
              <p>
                Are you sure you want to delete this provider? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>

                <Form method="post">
                  <input
                    type="hidden"
                    name="deletePsychiatristId"
                    value={selectedPsychiatrist.id}
                  />
                  <Button
                    type="submit"
                    variant="destructive"
                    onClick={() => setIsDeleteOpen(false)}
                  >
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
