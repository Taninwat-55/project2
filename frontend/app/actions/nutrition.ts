'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// MealSchema is used as type via z.infer
const MealSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});

export async function logMeal(data: z.infer<typeof MealSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("meal_logs").insert({
    user_id: user.id,
    name: data.name,
    meal_type: data.type,
    calories: data.calories,
    protein_g: data.protein,
    carbs_g: data.carbs,
    fat_g: data.fat,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/nutrition");
  return { success: true };
}

export async function getTodayMeals() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("meal_logs")
    .select("*")
    .gte("created_at", today.toISOString());

  return data || [];
}

// Funktion för att spara måltidsmallar
export async function saveMealTemplate(data: {
  name: string;
  ingredients: { name: string; kcal: number; p: number; c: number; f: number }[];
  totals: { kcal: number; p: number; c: number; f: number };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("meal_templates").insert({
    user_id: user.id,
    name: data.name,
    ingredients: data.ingredients,
    total_kcal: data.totals.kcal,
    total_protein: data.totals.p,
    total_carbs: data.totals.c,
    total_fat: data.totals.f,
  });

  if (error) {
    console.error("Database Error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/nutrition");
  return { success: true };
}

// Funktion för att se sparande måltidsmallar
export async function getMealTemplates() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("meal_templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching templates:", error.message);
    return [];
  }

  return data || [];
}