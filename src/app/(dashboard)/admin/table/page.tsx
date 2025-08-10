import { Metadata } from "next";
import { SearchParams } from "nuqs";
import { queryParamsSchema } from "@/lib/utils";
import TableManagement from "./_components/tables";

export const metadata: Metadata = {
  title: "Table - POS Realtime",
};

interface TablePageProps {
  searchParams: Promise<SearchParams>;
}

export default async function TablePage({ searchParams }: TablePageProps) {
  const resolvedQueryParams = await searchParams;
  const query = await queryParamsSchema.parseAsync(resolvedQueryParams);

  return <TableManagement query={query} />;
}
