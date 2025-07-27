"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at");

  return { data, error };
}
