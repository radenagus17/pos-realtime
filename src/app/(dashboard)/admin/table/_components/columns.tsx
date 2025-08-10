import { ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarCheck, EllipsisIcon } from "lucide-react";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { TableTypes } from "@/types/table";

function RowActions({ row }: { row: Row<TableTypes> }) {
  // const openDialogForm = useSetAtom(dialogFormAtom);
  // const setSelectedUser = useSetAtom(selectedUserAtom);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
          // onClick={() => {
          //   setSelectedUser({ ...row.original, type: "update" });
          //   openDialogForm(true);
          // }}
          >
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Share</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          // onClick={() => {
          //   setSelectedUser({ ...row.original, type: "delete" });
          //   openDialogForm(true);
          // }}
          className="text-destructive focus:text-destructive"
        >
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<TableTypes> = (
  row,
  columnId,
  filterValue
) => {
  const searchableRowContent = `${row.original.name}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const columns: ColumnDef<TableTypes>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="m-auto"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    accessorKey: "name",
    cell: ({ row }) => {
      const name = row.original.name;
      const description = row.original.description;

      return (
        <div className="flex flex-col py-2">
          <h3 className="text-sm font-medium text-tenka-typography-error capitalize">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      );
    },
    size: 130,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity" />
    ),
    accessorKey: "capacity",
    cell: ({ row }) => {
      const capacity = row.original.capacity;
      return <div className="flex flex-wrap gap-1">{capacity}</div>;
    },
    size: 90,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex flex-wrap gap-1">
          <Badge
            className="capitalize"
            variant={
              status === "available"
                ? "success"
                : status === "unavailable"
                ? "outline"
                : "default"
            }
          >
            {status}
          </Badge>
        </div>
      );
    },
    size: 90,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    accessorKey: "created_at",
    cell: ({ row }) => {
      const registered = row.original.created_at
        ? format(
            new Date(row.getValue("created_at")),
            "EEEE, dd MMM yyyy || HH:mm:ss"
          )
        : "N/A";
      return (
        <span className="inline-flex items-center gap-1.5">
          <CalendarCheck size={16} />
          {registered}
        </span>
      );
    },
    size: 180,
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-3">Actions</div>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];

export default columns;
