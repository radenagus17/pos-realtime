"use client";

import { Button } from "@/components/ui/button";
import columns from "./columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../lib/data";
import { toast } from "sonner";
import { Profile } from "@/types/auth";
import { DataTableFilterField } from "@/types/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import DataTable from "@/components/ui/data-table";
import DataTableAction from "@/components/ui/data-table-action";

const UsersManagement = () => {
  const { data: users, isLoading } = useQuery<Profile[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await getUsers();

      if (error)
        toast.error("Get User data failed", {
          description: error.message,
        });

      return data as Profile[];
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
    data: users ?? [],
    columns,
    pageCount: users?.length ?? -1,
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Create</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a user</DialogTitle>
                  </DialogHeader>
                  <div>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad
                    consequatur iusto ratione? Quidem repellat aperiam
                    asperiores perspiciatis neque facere eligendi.
                  </div>
                </DialogContent>
              </Dialog>
            )}
          />
        </DataTable>
      </section>
    </main>
  );
};

export default UsersManagement;
