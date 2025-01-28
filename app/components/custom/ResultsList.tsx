import React from "react";
import { Psychiatrist } from "~/types";
import FormHeader from "~/components/shared/FormHeader";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

interface ResultsListProps {
  psychiatrists?: Psychiatrist[];
  selectedPsychiatrist: Psychiatrist | null;
  setSelectedPsychiatrist: React.Dispatch<
    React.SetStateAction<Psychiatrist | null>
  >;
}

export default function ResultsList({
  psychiatrists,
  selectedPsychiatrist,
  setSelectedPsychiatrist,
}: ResultsListProps) {
  return (
    <div className="p-6">
      <FormHeader
        title="Available Psychiatrists"
        description="Results based on your search criteria."
      />

      {psychiatrists?.length ? (
        <ul className="space-y-4">
          {psychiatrists.map((psychiatrist) => (
            <li key={psychiatrist.id} className="border p-3 rounded-md">
              <Popover>
                <PopoverTrigger
                  asChild
                  onClick={() => setSelectedPsychiatrist(psychiatrist)}
                >
                  <button className="text-gray-700 hover:underline">
                    {psychiatrist.firstName} {psychiatrist.lastName},{" "}
                    {psychiatrist.credentials}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-full max-w-2xl max-h-[150vh] overflow-auto p-4">
                  <PsychiatristDetails psychiatrist={selectedPsychiatrist} />
                </PopoverContent>
              </Popover>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No psychiatrists found.</p>
      )}
    </div>
  );
}

function PsychiatristDetails({
  psychiatrist,
}: {
  psychiatrist: Psychiatrist | null;
}) {
  if (!psychiatrist) return <p>No details available</p>;

  return (
    <div>
      <p className="font-medium text-gray-900">
        {psychiatrist.firstName} {psychiatrist.lastName},{" "}
        {psychiatrist.credentials}
      </p>
      <p className="text-sm text-gray-700">
        Patients Accepted: {psychiatrist.numPatientsAccepted}
      </p>
      <p className="text-sm text-gray-700 mt-2">
        Appointment Length: {psychiatrist.initialApptLength} mins initial,{" "}
        {psychiatrist.followUpApptLength} mins follow up
      </p>
      <p className="text-sm text-gray-700 mt-2">Notes: {psychiatrist.notes}</p>
    </div>
  );
}
