"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

interface MealTemplateData {
  name: string;
  total_kcal?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  totals?: {
    kcal: number;
    p: number;
    c: number;
    f: number;
  };
}

// ... (behåll dina importer och interface som de är)

const MealSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});

export async function logMeal(data: z.infer<typeof MealSchema>) {
  const validatedData = MealSchema.parse(data);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("meal_logs").insert({
    user_id: user.id,
    name: validatedData.name,
    meal_type: validatedData.type,
    calories: validatedData.calories,
    protein_g: validatedData.protein,
    carbs_g: validatedData.carbs,
    fat_g: validatedData.fat,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/nutrition");
  return { success: true };
}


export async function getTodayMeals() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("meal_logs")
    .select("*")
    .gte("created_at", today.toISOString());

  return data || [];
}

export async function saveMealTemplate(data: {
  name: string;
  ingredients: { name: string; kcal: number; p: number; c: number; f: number }[];
  totals: { kcal: number; p: number; c: number; f: number };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

export async function getMealTemplates() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

export async function logMealFromTemplate(
  template: MealTemplateData,
  type: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("meal_logs").insert({
    user_id: user.id,
    name: template.name,
    meal_type: type,
    calories: template.total_kcal,
    protein_g: template.total_protein,
    carbs_g: template.total_carbs,
    fat_g: template.total_fat,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/nutrition");
  return { success: true };
}

// Ta bort måltider

export async function deleteMealLog(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // Utför raderingen
  const { error } = await supabase
    .from("meal_logs")
    .delete()
    .eq("id", id) // Detta ID måste vara UUID:t
    .eq("user_id", user.id);

  if (error) {
    console.error("Raderingsfel:", error.message);
    return { success: false, error: error.message };
  }

  // Uppdatera cachen för både översikten och den specifika listan
  revalidatePath("/nutrition");
  revalidatePath("/nutrition/[type]", "page"); 
  
  return { success: true };
}

// Redigera måltider
// Lägg till detta interface högst upp eller i din action-fil
interface UpdateMealData {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export async function updateMealLog(id: string, updates: UpdateMealData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("meal_logs")
    .update({
      name: updates.name,
      calories: Math.round(updates.calories),
      protein_g: Math.round(updates.protein_g),
      carbs_g: Math.round(updates.carbs_g),
      fat_g: Math.round(updates.fat_g),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/nutrition");
  revalidatePath("/nutrition/[type]", "page");
  return { success: true };
}