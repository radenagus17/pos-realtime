"use server";

import { createClient } from "@/lib/supabase/server";
import { GetQueryParams } from "@/lib/utils";

export async function getOrders(query: GetQueryParams) {
  const supabase = await createClient();

  let res;

  if (query.order_id) {
    res = await supabase
      .from("orders")
      .select(
        `id, order_id, customer_name, status, payment_url, table_id, created_at, tables (name, id)`,
        { count: "exact" }
      )
      .range((query.page - 1) * query.size, query.page * query.size - 1)
      .order("created_at")
      .or(
        `customer_name.ilike.%${query.order_id}%,order_id.ilike.%${query.order_id}%`
      );
  } else {
    res = await supabase
      .from("orders")
      .select(
        `id, order_id, customer_name, status, payment_url, table_id, created_at, tables (name, id)`,
        { count: "exact" }
      )
      .range((query.page - 1) * query.size, query.page * query.size - 1)
      .order("created_at");
  }

  return res;
}
