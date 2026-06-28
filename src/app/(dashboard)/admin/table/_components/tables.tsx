"use client";

import { useAtom } from "jotai";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import DataTableAction from "@/components/ui/data-table-action";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTable } from "@/hooks/use-data-table";
import { useTables } from "@/hooks/use-tables";
import { createClient } from "@/lib/supabase/client";
import type { GetQueryParams } from "@/lib/utils";
import { dialogFormAtom } from "@/stores/general-store";
import { selectedTableAtom } from "@/stores/table-store";
import type { DataTableFilterField } from "@/types/data-table";
import type { TableTypes } from "@/types/table";
import columns from "./columns";
import DialogCreateTable from "./dialog-create-table";
import DialogDeleteTable from "./dialog-delete-table";
import DialogUpdateTable from "./dialog-update-table";
import TableMap from "./table-map";

interface TableManagementProps {
	query: GetQueryParams;
}

const TableManagement = ({ query }: TableManagementProps) => {
	const [selectedMenu, setSelectedMenu] = useAtom(selectedTableAtom);
	const [openDialog, setOpenDialog] = useAtom(dialogFormAtom);
	const [tableTabs, setTableTabs] = useQueryState(
		"tabs",
		parseAsString
			.withOptions({
				history: "replace",
				scroll: false,
				shallow: true,
				throttleMs: 50,
			})
			.withDefault("list"),
	);

	const supabase = createClient();

	const { data: tables, isLoading, refetch } = useTables(query);

	const {
		data: allTables,
		isPending,
		refetch: refetchAllTable,
	} = useTables(null, "all-tables");

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

	useEffect(() => {
		const channel = supabase
			.channel("change-table")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "tables",
				},
				() => {
					refetch();
					refetchAllTable();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	});

	return (
		<main className="p-4">
			<Tabs defaultValue={tableTabs} onValueChange={(e) => setTableTabs(e)}>
				<div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
					<h1 className="font-bold text-2xl">Table Management</h1>
					<TabsList>
						<TabsTrigger value="list">Table List</TabsTrigger>
						<TabsTrigger value="map">Table Map</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="list">
					<article>
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
									<DialogUpdateTable />
								) : selectedMenu && selectedMenu.type === "delete" ? (
									<DialogDeleteTable />
								) : (
									<DialogCreateTable
										refetch={refetch}
										closeDialog={() => setOpenDialog(false)}
									/>
								)}
							</Dialog>
						</DataTable>
					</article>
				</TabsContent>
				<TabsContent value="map">
					{!isPending && <TableMap tables={allTables?.data || []} />}
				</TabsContent>
			</Tabs>
		</main>
	);
};

export default TableManagement;
