import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

type CheckboxGroupProps = {
  label: string;
  items: { id: number; name: string }[];
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function CheckboxGroup({
  label,
  items,
  selectedItems,
  setSelectedItems,
}: CheckboxGroupProps) {
  const allSelected = selectedItems.length === items.length;

  const handleSelectAll = (checked: boolean | string | null) => {
    setSelectedItems(checked ? items.map((item) => item.id) : []);
  };

  const handleCheckboxChange = (
    id: number,
    checked: boolean | string | null
  ) => {
    setSelectedItems((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };

  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
          id={`selectAll-${label}`}
        />
        <Label htmlFor={`selectAll-${label}`}>Select All</Label>
      </div>
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <Checkbox
            checked={selectedItems.includes(item.id)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(item.id, Boolean(checked))
            }
            id={`checkbox-${label}-${item.id}`}
          />
          <Label htmlFor={`checkbox-${label}-${item.id}`}>{item.name}</Label>
        </div>
      ))}
    </div>
  );
}
