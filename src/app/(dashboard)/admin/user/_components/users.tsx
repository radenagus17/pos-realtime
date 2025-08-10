"use client";

import { Button } from "@/components/ui/button";
import columns from "./columns";
import { Dialog } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../lib/data";
import { toast } from "sonner";
import { Profile } from "@/types/auth";
import { DataTableFilterField } from "@/types/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import DataTable from "@/components/ui/data-table";
import DataTableAction from "@/components/ui/data-table-action";
import { PostgrestError } from "@supabase/supabase-js";
import { GetQueryParams } from "@/lib/utils";
import DialogCreateUser from "./dialog-create-user";
import { useAtom } from "jotai";
import { selectedUserAtom } from "@/stores/user-store";
import DialogUpdateUser from "./dialog-update-user";
import DialogDeleteUser from "./dialog-delete-user";
import { dialogFormAtom } from "@/stores/general-store";

interface UsersManagementProps {
  query: GetQueryParams;
}

type ResultTypes = {
  data: Profile[] | null;
  error: PostgrestError | null;
  count: number | null;
};

const UsersManagement = ({ query }: UsersManagementProps) => {
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
  const [openDialog, setOpenDialog] = useAtom(dialogFormAtom);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery<ResultTypes>({
    queryKey: ["users", query],
    queryFn: async () => {
      const result = await getUsers(query);

      if (result.error)
        toast.error("Get User data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const filterFields: DataTableFilterField<Profile>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Search user...",
    },
  ];

  const { table } = useDataTable({
    data: users?.data ?? [],
    columns,
    pageCount: users?.count ? Math.ceil(users.count / query.size) : 0,
    filterFields,
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <main className="w-full p-4">
      <h1 className="font-bold text-2xl">User Management</h1>
      <section className="mt-7 w-full">
        <DataTable table={table} isLoading={isLoading} totalField={6}>
          <DataTableAction
            table={table}
            filterFields={filterFields}
            renderNewAction={() => (
              <Button
                onClick={() => {
                  setSelectedUser(null);
                  return setOpenDialog(true);
                }}
              >
                Create
              </Button>
            )}
          />
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
          </Dialog>
        </DataTable>
      </section>
    </main>
  );
};

export default UsersManagement;
