"use server";

import { createClient } from "@/lib/supabase/server";
import { GetQueryParams } from "@/lib/utils";

export async function getTables(query: GetQueryParams) {
  const supabase = await createClient();

  let res;

  if (query.name || query.status) {
    res = await supabase
      .from("tables")
      .select("*", { count: "exact" })
      .range((query.page - 1) * query.size, query.page * query.size - 1)
      .order("created_at")
      .or(`name.ilike.%${query.name}%,status.ilike.%${query.status}%`);
  } else {
    res = await supabase
      .from("tables")
      .select("*", { count: "exact" })
      .range((query.page - 1) * query.size, query.page * query.size - 1)
      .order("created_at");
  }

  return res;
}
