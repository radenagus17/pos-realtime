import type { Metadata } from "next";
import type { SearchParams } from "nuqs";
import { queryParamsSchema } from "@/lib/utils";
import MenuManagement from "./_components/menus";

export const metadata: Metadata = {
	title: "Menu - Qassa",
};

interface MenuPageProps {
	searchParams: Promise<SearchParams>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
	const resolvedQueryParams = await searchParams;
	const query = await queryParamsSchema.parseAsync(resolvedQueryParams);

	return <MenuManagement query={query} />;
}
