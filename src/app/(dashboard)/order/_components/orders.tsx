"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTableFilterField } from "@/types/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import DataTable from "@/components/ui/data-table";
import DataTableAction from "@/components/ui/data-table-action";
import { PostgrestError } from "@supabase/supabase-js";
import { GetQueryParams } from "@/lib/utils";
import { useAtom, useAtomValue } from "jotai";
import { dialogFormAtom } from "@/stores/general-store";
import { Dialog } from "@/components/ui/dialog";
import { OrderTypes } from "@/types/order";
import { getOrders } from "../lib/data";
import columns from "./columns";
import DialogCreateOrderDineIn from "./dialog-create-order-dine-in";
import { profileAtom } from "@/stores/auth-store";
import { createClientSupabase } from "@/lib/supabase/default";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Package, Utensils } from "lucide-react";
import DialogCreateOrderTakeaway from "./dialog-create-order-takeaway";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableMap from "./table-map";

interface OrderManagementProps {
  query: GetQueryParams;
}

type ResultTypes = {
  data: OrderTypes[] | null;
  error: PostgrestError | null;
  count: number | null;
};

enum SelectedOrder {
  dine = "dinein",
  take = "takeaway",
  empty = "",
}

const OrderManagement = ({ query }: OrderManagementProps) => {
  const supabase = createClientSupabase();
  const [openDialog, setOpenDialog] = useAtom(dialogFormAtom);
  const profile = useAtomValue(profileAtom);
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder>(
    SelectedOrder.empty,
  );

  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery<ResultTypes>({
    queryKey: ["orders", query],
    queryFn: async () => {
      const result = await getOrders(query);

      if (result.error)
        toast.error("Get Order data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("change-order")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          refetch();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, refetch]);

  const filterFields: DataTableFilterField<OrderTypes>[] = [
    {
      label: "Name",
      value: "order_id",
      placeholder: "Search order ID/Customer name",
    },
  ];

  const { table } = useDataTable({
    data: orders?.data ?? [],
    columns,
    pageCount: orders?.count ? Math.ceil(orders.count / query.size) : 0,
    filterFields,
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <main className="p-4">
      <Tabs defaultValue="list">
        <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
          <h1 className="font-bold text-2xl">Order Management</h1>
          <TabsList>
            <TabsTrigger value="list">Order List</TabsTrigger>
            <TabsTrigger value="map">Table Map</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="list">
          <article>
            <DataTable table={table} isLoading={isLoading} totalField={7}>
              <DataTableAction
                table={table}
                filterFields={filterFields}
                renderNewAction={() => (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`${
                        profile?.role !== "admin" ? "invisible" : "visible"
                      }`}
                      asChild
                    >
                      <Button>Create</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel className="font-bold">
                        Create Order
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setOpenDialog(true);
                          setSelectedOrder(SelectedOrder.dine);
                        }}
                      >
                        <Utensils className="size-4" />
                        Dine In
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setOpenDialog(true);
                          setSelectedOrder(SelectedOrder.take);
                        }}
                      >
                        <Package className="size-4" />
                        Takeaway
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              />
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                {selectedOrder === SelectedOrder.dine && (
                  <DialogCreateOrderDineIn
                    refetch={refetch}
                    closeDialog={() => setOpenDialog(false)}
                  />
                )}
                {selectedOrder === SelectedOrder.take && (
                  <DialogCreateOrderTakeaway
                    refetch={refetch}
                    closeDialog={() => setOpenDialog(false)}
                  />
                )}
              </Dialog>
            </DataTable>
          </article>
        </TabsContent>
        <TabsContent value="map">
          <TableMap />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default OrderManagement;
