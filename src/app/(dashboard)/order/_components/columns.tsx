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
import { OrderTypes } from "@/types/order";
// import { useSetAtom } from "jotai";
// import { dialogFormAtom } from "@/stores/general-store";
// import { selectedTableAtom } from "@/stores/table-store";

function RowActions({ row }: { row: Row<OrderTypes> }) {
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
          <DropdownMenuItem
          // onClick={() => {
          //   setSelectedTable({ ...row.original, type: "update" });
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
          //   setSelectedTable({ ...row.original, type: "delete" });
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
const multiColumnFilterFn: FilterFn<OrderTypes> = (
  row,
  columnId,
  filterValue
) => {
  const searchableRowContent =
    `${row.original.order_id} ${row.original.customer_name}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const columns: ColumnDef<OrderTypes>[] = [
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
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    accessorKey: "order_id",
    cell: ({ row }) => {
      const order_id = row.original.order_id;

      return <h3 className="text-sm font-medium capitalize">{order_id}</h3>;
    },
    size: 120,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Name" />
    ),
    accessorKey: "customer_name",
    cell: ({ row }) => {
      const customer = row.original.customer_name;
      return <p>{customer}</p>;
    },
    size: 140,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Table" />
    ),
    accessorKey: "table_id",
    cell: ({ row }) => {
      const table = row.original.tables as TableTypes;
      return <p>{table.name}</p>;
    },
    size: 125,
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
          variant={status === "process" ? "info" : "warning"}
        >
          {status}
        </Badge>
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
