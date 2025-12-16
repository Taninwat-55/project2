"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type MealData = {
  name: string;
  calories: number;
  protein?: number;
  type: "breakfast" | "lunch" | "dinner" | "snack";
};

export async function logMeal(data: MealData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("meal_logs").insert({
    user_id: user.id,
    name: data.name,
    meal_type: data.type,
    calories: data.calories,
    protein_g: data.protein || 0,
    eaten_at: new Date().toISOString(),
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}
