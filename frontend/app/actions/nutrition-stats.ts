"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAdjustedDailyGoal(baseGoal: number = 1500) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return baseGoal;

  // Hämta dagens datum (start och slut)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Hämta alla kalorier brända idag från 'workouts' tabellen
  const { data: workouts, error } = await supabase
    .from("workouts")
    .select("calories_burned")
    .eq("user_id", user.id)
    .gte("performed_at", today.toISOString())
    .lt("performed_at", tomorrow.toISOString());

  if (error) {
    console.error("Error fetching today's burned calories:", error);
    return baseGoal;
  }

  // Summera brända kalorier
  const burnedToday = workouts?.reduce((acc, w) => acc + (w.calories_burned || 0), 0) || 0;

  // Returnera det nya målet (Basmål + Brända kalorier)
  return {
    baseGoal,
    burnedToday,
    adjustedGoal: baseGoal + burnedToday
  };
}