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
import { EllipsisIcon } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { OrderMenuTypes } from "@/types/order";
import { MenuTypes } from "@/types/menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { convertIDR } from "@/lib/utils";

function RowActions({ row }: { row: Row<OrderMenuTypes> }) {
  // const openDialogForm = useSetAtom(dialogFormAtom);
  // const setSelectedTable = useSetAtom(selectedTableAtom);

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
          <DropdownMenuItem>
            <span>Process</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Canceled</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Detail</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<OrderMenuTypes> = (
  row,
  columnId,
  filterValue
) => {
  const searchableRowContent =
    `${row.original.order_id} ${row.original.menu_id}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const columns: ColumnDef<OrderMenuTypes>[] = [
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
      <DataTableColumnHeader column={column} title="Menu" />
    ),
    accessorKey: "menu_id",
    cell: ({ row }) => {
      const { name, image_url } = row.original.menus as MenuTypes;
      const notes = row.original.notes || "No notes";
      const qty = row.original.quantity || 0;

      return (
        <div className="flex items-center gap-3 py-2">
          <Avatar className="rounded-md size-10">
            <AvatarImage src={image_url} />
            <AvatarFallback className="uppercase">
              {name?.substring(0, 1) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold capitalize">
              {name || "Unknown"} <span className="normal-case">x{qty}</span>
            </h3>
            <p className="text-muted-foreground text-sm">{notes}</p>
          </div>
        </div>
      );
    },
    size: 130,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    accessorKey: "menus.price",
    cell: ({ row }) => {
      const menu = row.original.menus as MenuTypes;
      const price = (menu.price || 0) * (row.original.quantity || 1);
      return <p>{convertIDR(price)}</p>;
    },
    size: 100,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className="capitalize"
          variant={
            status === "process"
              ? "info"
              : status === "canceled"
              ? "destructive"
              : "warning"
          }
        >
          {status}
        </Badge>
      );
    },
    size: 90,
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
