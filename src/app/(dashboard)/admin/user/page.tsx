import { Metadata } from "next";
import UsersManagement from "./_components/users";
import { SearchParams } from "nuqs";
import { queryParamsSchema } from "@/lib/utils";

export const metadata: Metadata = {
  title: "User - POS Realtime",
};

interface UserPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function UserPage({ searchParams }: UserPageProps) {
  const resolvedQueryParams = await searchParams;
  const query = await queryParamsSchema.parseAsync(resolvedQueryParams);

  return <UsersManagement query={query} />;
}
