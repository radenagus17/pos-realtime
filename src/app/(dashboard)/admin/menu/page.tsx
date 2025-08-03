import { Metadata } from "next";
import MenuManagement from "./_components/menus";
import { SearchParams } from "nuqs";
import { queryParamsSchema } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Menu - POS Realtime",
};

interface MenuPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const resolvedQueryParams = await searchParams;
  const query = await queryParamsSchema.parseAsync(resolvedQueryParams);

  return <MenuManagement query={query} />;
}
