"use server";

import { createClient } from "@/utils/supabase/server";
import { DailySummary } from "@/types/database";

export async function getDailySummary(): Promise<DailySummary | null> {
  const supabase = await createClient();

  // 1. Get Current User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 2. Query the View we just created
  const { data, error } = await supabase
    .from("daily_summary")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching summary:", error);
    return null;
  }

  return data as DailySummary;
}
