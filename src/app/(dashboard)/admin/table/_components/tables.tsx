"use client";

import { Button } from "@/components/ui/button";
import columns from "./columns";
import { DataTableFilterField } from "@/types/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import DataTable from "@/components/ui/data-table";
import DataTableAction from "@/components/ui/data-table-action";
import { GetQueryParams } from "@/lib/utils";
import { useAtom } from "jotai";
import { dialogFormAtom } from "@/stores/general-store";
import { Dialog } from "@/components/ui/dialog";
import { TableTypes } from "@/types/table";
import DialogCreateTable from "./dialog-create-table";
import { selectedTableAtom } from "@/stores/table-store";
import DialogUpdateTable from "./dialog-update-table";
import DialogDeleteTable from "./dialog-delete-table";
import { useTables } from "@/hooks/use-tables";

interface TableManagementProps {
  query: GetQueryParams;
}

const TableManagement = ({ query }: TableManagementProps) => {
  const [selectedMenu, setSelectedMenu] = useAtom(selectedTableAtom);
  const [openDialog, setOpenDialog] = useAtom(dialogFormAtom);

  const { data: tables, isLoading, refetch } = useTables(query);

  const filterFields: DataTableFilterField<TableTypes>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Search by name...",
    },
    {
      label: "Status",
      value: "status",
      options: [
        {
          label: "Available",
          value: "available",
          withCount: false,
        },
        {
          label: "Unvailable",
          value: "unavailable",
          withCount: false,
        },
        {
          label: "Reserved",
          value: "reserved",
          withCount: false,
        },
      ],
    },
  ];

  const { table } = useDataTable({
    data: tables?.data ?? [],
    columns,
    pageCount: tables?.count ? Math.ceil(tables.count / query.size) : 0,
    filterFields,
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <main className="w-full p-4">
      <h1 className="font-bold text-2xl">Table Management</h1>
      <section className="mt-7 w-full">
        <DataTable table={table} isLoading={isLoading} totalField={6}>
          <DataTableAction
            table={table}
            filterFields={filterFields}
            renderNewAction={() => (
              <Button
                onClick={() => {
                  setSelectedMenu(null);
                  return setOpenDialog(true);
                }}
              >
                Create
              </Button>
            )}
          />
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            {selectedMenu && selectedMenu.type === "update" ? (
              <DialogUpdateTable refetch={refetch} />
            ) : selectedMenu && selectedMenu.type === "delete" ? (
              <DialogDeleteTable refetch={refetch} />
            ) : (
              <DialogCreateTable
                refetch={refetch}
                closeDialog={() => setOpenDialog(false)}
              />
            )}
          </Dialog>
        </DataTable>
      </section>
    </main>
  );
};

export default TableManagement;
