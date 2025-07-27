import {
  CircleXIcon,
  Columns3Icon,
  ListFilterIcon,
  TrashIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { ReactNode, useId, useMemo, useRef } from "react";
import { DataTableFilterField } from "@/types/data-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
// import { useSetAtom } from "jotai";
// import { dialogAlertDelete } from "@/store";
interface DataTableActionProps<TData> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  renderNewAction?: () => ReactNode;
}

const DataTableAction = <TData,>({
  table,
  filterFields = [],
  renderNewAction,
}: DataTableActionProps<TData>) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  // const setOpenDialogDelete = useSetAtom(dialogAlertDelete);

  const { searchableColumns, filterableColumns } = useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : "") && (
                <div key={String(column.value)} className="relative">
                  <Input
                    id={`${id}-input`}
                    ref={inputRef}
                    className={cn(
                      "peer min-w-60 ps-9",
                      Boolean(
                        table.getColumn(String(column.value))?.getFilterValue()
                      ) && "pe-9"
                    )}
                    value={
                      (table
                        .getColumn(String(column.value))
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      table
                        .getColumn(String(column.value))
                        ?.setFilterValue(value);
                    }}
                    placeholder={column.placeholder}
                    type="text"
                    aria-label="Search user"
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 ps-2 flex items-center justify-center peer-disabled:opacity-50">
                    <ListFilterIcon size={16} aria-hidden="true" />
                  </div>
                  {Boolean(
                    table.getColumn(String(column.value))?.getFilterValue()
                  ) && (
                    <button
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Clear filter"
                      onClick={() => {
                        table
                          .getColumn(String(column.value))
                          ?.setFilterValue("");

                        // Clear URL param
                        const searchParams = new URLSearchParams(
                          window.location.search
                        );

                        searchParams.delete(String(column.value));
                        window.history.pushState(
                          {},
                          "",
                          `?${searchParams.toString()}`
                        );

                        if (inputRef.current) {
                          inputRef.current.focus();
                        }
                      }}
                    >
                      <CircleXIcon size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              )
          )}
        {/* Filter by status */}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : "") && (
                <DataTableFacetedFilter
                  key={String(column.value)}
                  column={table.getColumn(
                    column.value ? String(column.value) : ""
                  )}
                  name={column.label}
                  options={column.options ?? []}
                />
              )
          )}
        {/* Toggle columns visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Columns3Icon
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    onSelect={(event) => event.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* selected delete */}
      <div className="flex items-center gap-3">
        {/* Delete button */}
        {table.getSelectedRowModel().rows.length > 0 && (
          <Button
            className="ml-auto"
            variant="outline"
            // onClick={() => setOpenDialogDelete(true)}
          >
            <TrashIcon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Delete
            <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              {table.getSelectedRowModel().rows.length}
            </span>
          </Button>
        )}
        {/* Add user button */}
        {renderNewAction && renderNewAction()}
      </div>
    </div>
  );
};

export default DataTableAction;
