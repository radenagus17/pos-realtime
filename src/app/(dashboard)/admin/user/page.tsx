import type { Metadata } from "next";
import type { SearchParams } from "nuqs";
import { queryParamsSchema } from "@/lib/utils";
import UsersManagement from "./_components/users";

export const metadata: Metadata = {
	title: "User - Qassa",
};

interface UserPageProps {
	searchParams: Promise<SearchParams>;
}

export default async function UserPage({ searchParams }: UserPageProps) {
	const resolvedQueryParams = await searchParams;
	const query = await queryParamsSchema.parseAsync(resolvedQueryParams);

	return <UsersManagement query={query} />;
}
