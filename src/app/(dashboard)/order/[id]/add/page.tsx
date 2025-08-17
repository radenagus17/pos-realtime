import { Metadata } from "next";
import { SearchParams } from "nuqs";
import { queryParamsSchema } from "@/lib/utils";
import AddOrderItem from "./_components/add-order-item";

export const metadata: Metadata = {
  title: "Detail Order - POS Realtime",
};

interface MenuOrderPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

export default async function MenuOrderPage({
  searchParams,
  params,
}: MenuOrderPageProps) {
  const resolvedQueryParams = await searchParams;
  const resolvedParams = await params;
  const query = await queryParamsSchema.parseAsync(resolvedQueryParams);
  const orderId = resolvedParams.id;

  return <AddOrderItem query={query} orderId={orderId} />;
}
