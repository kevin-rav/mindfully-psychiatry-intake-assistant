// ManagePsychiatrists Component
// This component provides a user interface for managing the list of psychiatrists

import { useState } from "react";
import { Form } from "@remix-run/react";
import PsychiatristForm from "~/components/custom/PsychiatristForm";
import TableWithActions from "~/components/shared/TableWithActions";
import { Psychiatrist, Entity } from "~/types";
import FormHeader from "~/components/shared/FormHeader";

// shadcn components
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

// Props for the EditList component
type EditListProps = {
  psychiatrists: Psychiatrist[]; // List of psychiatrists to display
  allInsurances: Entity[]; // List of all insurances available
  allLocations: Entity[]; // List of all locations available
  allAgeGroups: Entity[]; // List of all age groups available
  allConditions: Entity[]; // List of all conditions available
  allMedications: Entity[]; // List of all medications available
  onPsychiatristUpdated: () => void; // Callback triggered after updates
};

export default function EditList({
  psychiatrists,
  allInsurances,
  allLocations,
  allAgeGroups,
  allConditions,
  allMedications,
  onPsychiatristUpdated,
}: EditListProps) {
  // State to manage dialog visibility and selected psychiatrist
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Visibility state for Add/Edit dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // Visibility state for Delete dialog
  const [selectedPsychiatrist, setSelectedPsychiatrist] =
    useState<Psychiatrist | null>(null); // Currently selected psychiatrist for editing or deleting

  // Handler for "Add Provider" button
  const handleAddClick = () => {
    setSelectedPsychiatrist(null); // Null indicates add mode
    setIsDialogOpen(true); // Open the Add/Edit dialog
  };

  // Handler for "Edit" button
  const handleEditClick = (psychiatrist: Psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist); // Set the psychiatrist to edit
    setIsDialogOpen(true); // Open the Add/Edit dialog
  };

  // Handler for "Delete" button
  const handleDeleteClick = (psychiatrist: Psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist); // Set the psychiatrist to delete
    setIsDeleteOpen(true); // Open the Delete confirmation dialog
  };

  // Callback triggered on successful Add/Edit/Delete actions
  const handleSuccess = () => {
    setIsDialogOpen(false); // Close Add/Edit dialog
    setIsDeleteOpen(false); // Close Delete dialog
    onPsychiatristUpdated(); // Notify parent component of updates
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <FormHeader
        title="Manage Providers"
        description="Manage and edit the list of providers."
        buttonText="Add Provider"
        onButtonClick={handleAddClick}
      />

      {/* Table of Psychiatrists */}
      <TableWithActions
        data={psychiatrists}
        columns={[
          { label: "First Name", accessor: "firstName" },
          { label: "Last Name", accessor: "lastName" },
        ]}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Add/Edit Psychiatrist Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl w-full h-5/6 bg-gray-50 overflow-hidden">
          <div className="overflow-y-auto p-6">
            <PsychiatristForm
              psychiatrist={selectedPsychiatrist || undefined} // Null indicates Add mode
              allInsurances={allInsurances}
              allLocations={allLocations}
              allAgeGroups={allAgeGroups}
              allConditions={allConditions}
              allMedications={allMedications}
              onSuccess={handleSuccess} // Callback on successful submission
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Psychiatrist Confirmation Dialog */}
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
                {/* Cancel button for deletion dialog */}
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                {/* Form for confirming deletion */}
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
