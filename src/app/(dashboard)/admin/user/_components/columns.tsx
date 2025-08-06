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
import { Profile } from "@/types/auth";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSetAtom } from "jotai";
import { selectedUserAtom } from "@/stores/user-store";
import { dialogFormAtom } from "@/stores/general-store";

function RowActions({ row }: { row: Row<Profile> }) {
  const openDialogForm = useSetAtom(dialogFormAtom);
  const setSelectedUser = useSetAtom(selectedUserAtom);
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
            onClick={() => {
              setSelectedUser({ ...row.original, type: "update" });
              openDialogForm(true);
            }}
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
          onClick={() => {
            setSelectedUser({ ...row.original, type: "delete" });
            openDialogForm(true);
          }}
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
const multiColumnFilterFn: FilterFn<Profile> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.role}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const columns: ColumnDef<Profile>[] = [
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
      const avatar = row.original.avatar_url;
      const name = row.original.name;

      return (
        <div className="flex items-center gap-4 py-2">
          <Avatar>
            <AvatarImage src={avatar} />
            <AvatarFallback className="uppercase">
              {name?.substring(0, 1) || "U"}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-sm font-medium text-tenka-typography-error capitalize">
            {name || "Unknown"}
          </h3>
        </div>
      );
    },
    size: 150,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    accessorKey: "role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <div className="flex flex-wrap gap-1">
          <Badge variant={"outline"}>{role || "-"}</Badge>
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    accessorKey: "updated_at",
    cell: ({ row }) => {
      const updated = row.original.updated_at
        ? format(
            new Date(row.getValue("updated_at")),
            "EEEE, dd MMM yyyy || HH:mm:ss"
          )
        : "N/A";
      return (
        <span className="inline-flex items-center gap-1.5">
          <CalendarCheck size={16} />
          {updated}
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
