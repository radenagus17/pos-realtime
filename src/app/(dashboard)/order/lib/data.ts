"use server";

import { createClient } from "@/lib/supabase/server";
import { GetQueryParams } from "@/lib/utils";
import { OrderMenuTypes, OrderTypes } from "@/types/order";

export type ResponseTypes = {
  dataOrder: OrderTypes | null;
  orderMenu: OrderMenuTypes[] | null;
  count: number | null;
};

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

export async function getOrderById(
  orderId: string,
  query: GetQueryParams
): Promise<ResponseTypes> {
  const supabase = await createClient();

  const resOrder = await supabase
    .from("orders")
    .select("id, customer_name, status, payment_url, tables (name, id)")
    .eq("order_id", orderId)
    .single();

  const resultOrder = resOrder.data;

  const resOrderMenu = await supabase
    .from("orders_menus")
    .select("*, menus (id, name, image_url, price)", { count: "exact" })
    .eq("order_id", resultOrder?.id)
    .range((query.page - 1) * query.size, query.page * query.size - 1)
    .order("created_at")
    .order("status");

  const resultOrderMenu = resOrderMenu.data;

  return {
    dataOrder: resultOrder,
    orderMenu: resultOrderMenu,
    count: resOrderMenu.count,
  };
}
