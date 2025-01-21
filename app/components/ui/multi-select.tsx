import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "~/lib/utils";

type MultiSelectProps = {
  options: { id: number; name: string }[];
  selectedValues: number[];
  onChange: (values: number[]) => void;
  placeholder?: string;
  label?: string;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  label,
}) => {
  const handleSelect = (id: number) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((value) => value !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const clearAll = () => {
    onChange([]); // Clear all selected options
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Popover.Root>
        <Popover.Trigger
          className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <div className="flex items-center gap-2">
            {selectedValues.length > 0
              ? options
                  .filter((option) => selectedValues.includes(option.id))
                  .map((option) => option.name)
                  .join(", ")
              : placeholder}
          </div>
          <div className="flex items-center gap-2">
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening the dropdown
                  clearAll();
                }}
                className="text-muted-foreground hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Popover.Trigger>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-full rounded-md border bg-white p-2 shadow-md"
        >
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
              onClick={() => handleSelect(option.id)}
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center border rounded",
                  selectedValues.includes(option.id)
                    ? "bg-black text-white"
                    : "bg-white"
                )}
              >
                {selectedValues.includes(option.id) && <Check size={16} />}
              </div>
              <span>{option.name}</span>
            </div>
          ))}
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};
