import { Metadata } from "next";
import { SearchParams } from "nuqs";
import { queryParamsSchema } from "@/lib/utils";
import MenuOrderManagement from "./_components/menu-order";

export const metadata: Metadata = {
  title: "Detail Order - POS Realtime",
};

interface DetailOrderPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

export default async function DetailOrderPage({
  searchParams,
  params,
}: DetailOrderPageProps) {
  const resolvedQueryParams = await searchParams;
  const resolvedParams = await params;
  const query = await queryParamsSchema.parseAsync(resolvedQueryParams);
  const orderId = resolvedParams.id;

  return <MenuOrderManagement query={query} orderId={orderId} />;
}
