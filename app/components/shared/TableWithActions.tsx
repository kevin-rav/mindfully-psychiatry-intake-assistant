import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";

interface TableWithActionsProps<T extends { id: React.Key }> {
  data: T[];
  columns: { label: string; accessor: keyof T }[];
  onEdit?: (item: T) => void;
  onDelete: (item: T) => void;
}

export default function TableWithActions<T extends { id: React.Key }>({
  data,
  columns,
  onEdit,
  onDelete,
}: TableWithActionsProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.label}>{column.label}</TableHead>
          ))}
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {columns.map((column) => (
              <TableCell key={`${item.id}-${column.accessor.toString()}`}>
                {String(item[column.accessor])}
              </TableCell>
            ))}
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(item)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
