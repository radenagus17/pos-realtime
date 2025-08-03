"use server";

import { createClient } from "@/lib/supabase/server";
import { GetQueryParams } from "@/lib/utils";

export async function getMenus(query: GetQueryParams) {
  const supabase = await createClient();

  let res;

  if (query.name) {
    res = await supabase
      .from("menus")
      .select("*", { count: "exact" })
      .range((query.page - 1) * query.size, query.page * query.size - 1)
      .order("created_at")
      .or(`name.ilike.%${query.name}%,category.ilike.%${query.name}%`);
  } else {
    res = await supabase
      .from("menus")
      .select("*", { count: "exact" })
      .range((query.page - 1) * query.size, query.page * query.size - 1)
      .order("created_at");
  }

  return res;
}
