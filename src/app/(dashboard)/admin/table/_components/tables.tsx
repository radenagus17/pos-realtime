"use client";

import { Button } from "@/components/ui/button";
import columns from "./columns";
import { useQuery } from "@tanstack/react-query";
import { getTables } from "../lib/data";
import { toast } from "sonner";
import { DataTableFilterField } from "@/types/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import DataTable from "@/components/ui/data-table";
import DataTableAction from "@/components/ui/data-table-action";
import { PostgrestError } from "@supabase/supabase-js";
import { GetQueryParams } from "@/lib/utils";
import { useAtom } from "jotai";
import { dialogFormAtom } from "@/stores/general-store";
import { Dialog } from "@/components/ui/dialog";
import { TableTypes } from "@/types/table";
import DialogCreateTable from "./dialog-create-table";
import { useId } from "react";

interface TableManagementProps {
  query: GetQueryParams;
}

type ResultTypes = {
  data: TableTypes[] | null;
  error: PostgrestError | null;
  count: number | null;
};

const TableManagement = ({ query }: TableManagementProps) => {
  const id = useId();
  // const [selectedMenu, setSelectedMenu] = useAtom(selectedMenuAtom);
  const [openDialog, setOpenDialog] = useAtom(dialogFormAtom);

  const {
    data: tables,
    isLoading,
    refetch,
  } = useQuery<ResultTypes>({
    queryKey: ["tables", query],
    queryFn: async () => {
      const result = await getTables(query);

      if (result.error)
        toast.error("Get Table data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

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
              <Button onClick={() => setOpenDialog(true)}>Create</Button>
            )}
          />
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogCreateTable
              refetch={refetch}
              closeDialog={() => setOpenDialog(false)}
            />
            {/* {selectedMenu && selectedMenu.type === "update" ? (
              <DialogUpdateMenu refetch={refetch} />
            ) : selectedMenu && selectedMenu.type === "delete" ? (
              <DialogDeleteMenu refetch={refetch} />
            ) : (
              <DialogCreateMenu
                refetch={refetch}
                closeDialog={() => setOpenDialog(false)}
              />
            )} */}
          </Dialog>
        </DataTable>
      </section>
    </main>
  );
};

export default TableManagement;
