"use client";

import { Button } from "@/components/ui/button";
import columns from "./columns";
// import { Dialog } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getMenus } from "../lib/data";
import { toast } from "sonner";
import { DataTableFilterField } from "@/types/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import DataTable from "@/components/ui/data-table";
import DataTableAction from "@/components/ui/data-table-action";
import { PostgrestError } from "@supabase/supabase-js";
import { GetQueryParams } from "@/lib/utils";
// import DialogCreateUser from "./dialog-create-user";
import { useAtom, useAtomValue } from "jotai";
import { dialogFormUserAtom, selectedUserAtom } from "@/stores/user-store";
// import DialogUpdateUser from "./dialog-update-user";
// import DialogDeleteUser from "./dialog-delete-user";
import { MenuTypes } from "@/types/menu";

interface MenuManagementProps {
  query: GetQueryParams;
}

type ResultTypes = {
  data: MenuTypes[] | null;
  error: PostgrestError | null;
  count: number | null;
};

const MenuManagement = ({ query }: MenuManagementProps) => {
  const selectedUser = useAtomValue(selectedUserAtom);
  const [openDialog, setOpenDialog] = useAtom(dialogFormUserAtom);

  const {
    data: menus,
    isLoading,
    refetch,
  } = useQuery<ResultTypes>({
    queryKey: ["menus", query],
    queryFn: async () => {
      const result = await getMenus(query);

      if (result.error)
        toast.error("Get User data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const filterFields: DataTableFilterField<MenuTypes>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Search name/category",
    },
  ];

  const { table } = useDataTable({
    data: menus?.data ?? [],
    columns,
    pageCount: menus?.count ? Math.ceil(menus.count / query.size) : 0,
    filterFields,
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <main className="w-full p-4">
      <h1 className="font-bold text-2xl">Menu Management</h1>
      <section className="mt-7 w-full">
        <DataTable table={table} isLoading={isLoading} totalField={7}>
          <DataTableAction
            table={table}
            filterFields={filterFields}
            renderNewAction={() => (
              <Button onClick={() => setOpenDialog(true)}>Create</Button>
            )}
          />
          {/* <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            {selectedUser && selectedUser.type === "update" ? (
              <DialogUpdateUser refetch={refetch} />
            ) : selectedUser && selectedUser.type === "delete" ? (
              <DialogDeleteUser refetch={refetch} />
            ) : (
              <DialogCreateUser
                refetch={refetch}
                closeDialog={() => setOpenDialog(false)}
              />
            )}
          </Dialog> */}
        </DataTable>
      </section>
    </main>
  );
};

export default MenuManagement;
