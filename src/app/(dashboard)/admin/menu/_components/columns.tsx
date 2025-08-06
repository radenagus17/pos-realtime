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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSetAtom } from "jotai";
import { MenuTypes } from "@/types/menu";
import { convertIDR } from "@/lib/utils";

function RowActions({ row }: { row: Row<MenuTypes> }) {
  // const openDialogForm = useSetAtom(dialogFormUserAtom);
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
const multiColumnFilterFn: FilterFn<MenuTypes> = (
  row,
  columnId,
  filterValue
) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.category}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const columns: ColumnDef<MenuTypes>[] = [
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
      const image = row.original.image_url;
      const name = row.original.name;
      const category = row.original.category;

      return (
        <div className="flex items-center gap-3 py-2">
          <Avatar className="rounded-md size-10">
            <AvatarImage src={image} />
            <AvatarFallback className="uppercase">
              {name?.substring(0, 1) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold capitalize">
              {name || "Unknown"}
            </h3>
            <p className="text-muted-foreground text-sm">#{category}</p>
          </div>
        </div>
      );
    },
    size: 110,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    accessorKey: "description",
    cell: ({ row }) => {
      const description = row.original.description;
      return <p className="text-wrap line-clamp-2 max-w-64">{description}</p>;
    },
    size: 150,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    accessorKey: "price",
    cell: ({ row }) => {
      const base = row.original.price;
      const discount = row.original.discount;
      return (
        <ul>
          <li className="text-wrap">Base: {base ? convertIDR(base) : "-"}</li>
          <li className="text-wrap">
            Discount: {discount ? discount + "%" : "-"}
          </li>
          <li className="text-wrap">
            After Discount:{" "}
            {discount && base
              ? convertIDR(base - (base * discount) / 100)
              : "-"}
          </li>
        </ul>
      );
    },
    size: 115,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available" />
    ),
    accessorKey: "is_available",
    cell: ({ row }) => {
      const available = row.original.is_available;
      return (
        <Badge variant={available ? "success" : "outline"}>
          {available ? "Available" : "Not Available"}
        </Badge>
      );
    },
    size: 85,
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
    size: 150,
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
