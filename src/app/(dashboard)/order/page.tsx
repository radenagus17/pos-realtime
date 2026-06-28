import type { Metadata } from "next";
import type { SearchParams } from "nuqs";
import { queryParamsSchema } from "@/lib/utils";
import OrderManagement from "./_components/orders";

export const metadata: Metadata = {
	title: "Order - Qassa",
};

interface OrderPageProps {
	searchParams: Promise<SearchParams>;
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
	const resolvedQueryParams = await searchParams;
	const query = await queryParamsSchema.parseAsync(resolvedQueryParams);

	return <OrderManagement query={query} />;
}
