"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import DataTableAction from "@/components/ui/data-table-action";
import { useDataTable } from "@/hooks/use-data-table";
import { createClientSupabase } from "@/lib/supabase/default";
import type { GetQueryParams } from "@/lib/utils";
import { profileAtom } from "@/stores/auth-store";
import type { OrderMenuTypes, OrderTypes } from "@/types/order";
import { getOrderById } from "../../lib/data";
import getColumns from "./columns";
import Receipt from "./receipt";
import Summary from "./summary";

interface MenuOrderManagementProps {
	query: GetQueryParams;
	orderId: string;
}

const MenuOrderManagement = ({ query, orderId }: MenuOrderManagementProps) => {
	const profile = useAtomValue(profileAtom);
	const supabase = createClientSupabase();

	const {
		data: order,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["orders_menu", query, orderId],
		queryFn: () => getOrderById(orderId, query),
		enabled: !!orderId, // Only run if orderId is available
	});

	const columns = useMemo(() => {
		return getColumns({ refetch });
	}, [refetch]);

	useEffect(() => {
		if (!order?.dataOrder?.id) return;

		const channel = supabase
			.channel("change-menu-order")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "orders_menus",
					filter: `order_id=eq.${order.dataOrder.id}`,
				},
				() => {
					refetch();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [order?.dataOrder?.id, refetch, supabase]);

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
							<>
								<Button
									asChild
									className={`${
										profile.role !== "kitchen" ? "visible" : "invisible"
									}`}
								>
									<Link prefetch href={`/order/${orderId}/add`}>
										Add Order Item
									</Link>
								</Button>
								{order?.dataOrder?.status === "settled" && (
									<Receipt
										order={order.dataOrder}
										orderMenu={order.orderMenu}
										orderId={orderId}
									/>
								)}
							</>
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
