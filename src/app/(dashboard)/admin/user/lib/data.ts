"use server";

import { createClient } from "@/lib/supabase/server";
import { GetQueryParams } from "@/lib/utils";

export async function getUsers(query: GetQueryParams) {
  const supabase = await createClient();

  let res;

  if (query.name) {
    res = await supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .range((query.page - 1) * query.size, query.page * query.size - 1)
      .order("created_at")
      .ilike("name", `%${query.name}%`);
  } else {
    res = await supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .range((query.page - 1) * query.size, query.page * query.size - 1)
      .order("created_at");
  }

  return res;
}
