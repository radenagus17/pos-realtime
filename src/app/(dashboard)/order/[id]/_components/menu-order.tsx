"use client";

import { useQuery } from "@tanstack/react-query";
import { useDataTable } from "@/hooks/use-data-table";
import DataTable from "@/components/ui/data-table";
import DataTableAction from "@/components/ui/data-table-action";
import { GetQueryParams } from "@/lib/utils";
import { OrderMenuTypes, OrderTypes } from "@/types/order";
import { getOrderById } from "../../lib/data";
import columns from "./columns";
import Summary from "./summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MenuOrderManagementProps {
  query: GetQueryParams;
  orderId: string;
}

const MenuOrderManagement = ({ query, orderId }: MenuOrderManagementProps) => {
  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders_menu", query, orderId],
    queryFn: () => getOrderById(orderId, query),
    enabled: !!orderId, // Only run if orderId is available
  });

  const { table } = useDataTable({
    data: order?.orderMenu ?? [],
    columns,
    pageCount: order?.count ? Math.ceil(order.count / query.size) : 0,
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <main className="w-full p-4">
      <h1 className="font-bold text-2xl">Order Menu Management</h1>
      <section className="mt-7 flex items-start gap-3">
        <DataTable
          table={table}
          isLoading={isLoading}
          totalField={5}
          className="lg:basis-2/3"
        >
          <DataTableAction
            table={table}
            renderNewAction={() => (
              <Button asChild>
                <Link prefetch href={`/order/${orderId}/add`}>
                  Add Order Item
                </Link>
              </Button>
            )}
          />
        </DataTable>
        {order && (
          <div className="lg:basis-1/3">
            <Summary
              order={order?.dataOrder as Partial<OrderTypes>}
              orderMenu={order?.orderMenu as OrderMenuTypes[]}
              id={orderId}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default MenuOrderManagement;
