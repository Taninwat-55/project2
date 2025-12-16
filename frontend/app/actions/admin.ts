"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function seedData() {
  const supabase = await createClient();

  // 1. Get Current User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // 2. Clear existing logs (Clean slate)
  await supabase.from("meal_logs").delete().eq("user_id", user.id);
  await supabase.from("workouts").delete().eq("user_id", user.id);

  // 3. Reset Profile (Upsert ensures it works even if profile is missing)
  await supabase.from("profiles").upsert({
    id: user.id,
    first_name: "Demo",
    last_name: "User",
    gender: "male",
    weight_kg: 80,
    height_cm: 180,
    date_of_birth: "1995-01-01",
    activity_level: "moderately_active",
    daily_calorie_goal: 2800,
    updated_at: new Date().toISOString(),
  });

  // 4. Insert Fake Meals
  const today = new Date().toISOString();
  await supabase.from("meal_logs").insert([
    {
      user_id: user.id,
      name: "Oatmeal & Berries",
      meal_type: "breakfast",
      calories: 450,
      protein_g: 12,
      eaten_at: today,
    },
    {
      user_id: user.id,
      name: "Chicken Caesar Salad",
      meal_type: "lunch",
      calories: 650,
      protein_g: 45,
      eaten_at: today,
    },
    {
      user_id: user.id,
      name: "Greek Yogurt",
      meal_type: "snack",
      calories: 150,
      protein_g: 15,
      eaten_at: today,
    },
  ]);

  // 5. Insert Fake Workout
  await supabase.from("workouts").insert([
    {
      user_id: user.id,
      name: "Upper Body Power",
      duration_minutes: 60,
      calories_burned: 420,
      status: "completed",
      performed_at: today,
    },
  ]);

  // 6. Refresh the Dashboard
  revalidatePath("/dashboard");

  return { success: true };
}
