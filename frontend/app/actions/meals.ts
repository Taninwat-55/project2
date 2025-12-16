"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { MealSchema } from "@/lib/schemas"; // <--- Make sure this file exists!
import { z } from "zod";

// We can infer the TypeScript type directly from the Zod Schema!
type MealData = z.infer<typeof MealSchema>;

export async function logMeal(data: MealData) {
  // 1. Validate Data with Zod
  const validation = MealSchema.safeParse(data);

  if (!validation.success) {
    // Return the first error message to the UI
    // CHANGE: Use .issues instead of .errors
    return { success: false, error: validation.error.issues[0].message };
  }

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
