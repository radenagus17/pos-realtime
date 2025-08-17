import { createClient } from "@/lib/supabase/client";
import { GetQueryParams } from "@/lib/utils";
import { TableTypes } from "@/types/table";
import { PostgrestError } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type ResultTypes = {
  data: TableTypes[] | null;
  error: PostgrestError | null;
  count: number | null;
};

export function useTables(query?: GetQueryParams) {
  const supabase = createClient();
  const tables = useQuery<ResultTypes>({
    queryKey: ["tables", query],
    queryFn: async () => {
      const res = supabase
        .from("tables")
        .select("*", { count: "exact" })
        .order("created_at")
        .order("status");

      if (query?.page && query?.size)
        res.range(
          (query?.page - 1) * query?.size,
          query?.page * query?.size - 1
        );

      if (query?.name || query?.status)
        res.or(`name.ilike.%${query?.name}%,status.ilike.%${query?.status}%`);

      const serverSideRes = await res;

      if (serverSideRes.error)
        toast.error("Get Table data failed", {
          description: serverSideRes.error.message,
        });

      return res;
    },
  });

  return tables;
}
