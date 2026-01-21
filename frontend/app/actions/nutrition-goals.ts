"use server";

import { createClient } from "@/utils/supabase/server";
import { getUserSettings } from "./settings";

// --- TYPER ---
interface ProfileData {
  daily_calorie_goal: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  gender: string | null;
  date_of_birth: string | null;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  hasProfile: boolean;
}

export interface TodayNutrition {
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  caloriesBurned: number;
}

// --- LOGIK FÖR BERÄKNING ---

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function calculateDailyCalories(
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  primaryFocus: string,
  weeklyGoalKg: number 
): number {
  // 1. BMR
  let bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  if (gender === "male") bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;

  // 2. TDEE (Maintenance)
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderate: 1.55,
    very_active: 1.725,
  };
  const maintenance = bmr * (activityMultipliers[activityLevel] || 1.2);

  // 3. JUSTERING
  // 0.5kg motsvarar ca 300 kcal underskott med din formel (0.5 * 600)
  const dailyAdjustment = Math.abs(weeklyGoalKg) * 600; 

  if (primaryFocus === "weight_loss") {
    return Math.round(maintenance - dailyAdjustment);
  } else if (primaryFocus === "weight_gain") {
    return Math.round(maintenance + dailyAdjustment);
  }

  return Math.round(maintenance);
}

function calculateMacros(calories: number, weight: number): Omit<NutritionGoals, "hasProfile"> {
  // Dessa procent fungerar för alla kroppstyper:
  const proteinPercent = 0.21; // 21% Protein
  const fatPercent = 0.32;     // 32% Fett
  const carbPercent = 0.47;     // 47% Kolhydrater

  return {
    calories: Math.round(calories),
    protein: Math.round((calories * proteinPercent) / 4),
    carbs: Math.round((calories * carbPercent) / 4),
    fat: Math.round((calories * fatPercent) / 9),
  };
}

// --- ACTIONS ---

export async function getNutritionGoals(): Promise<NutritionGoals> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const DEFAULT_VALUES: NutritionGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
    hasProfile: false,
  };

  if (!user) return DEFAULT_VALUES;

  const settings = await getUserSettings();

  const { data: profile } = await supabase
    .from("profiles")
    .select("daily_calorie_goal, weight_kg, height_cm, gender, date_of_birth")
    .eq("id", user.id)
    .single<ProfileData>();

  if (!profile || !profile.weight_kg || !profile.height_cm) {
    return DEFAULT_VALUES;
  }

  const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : 25;
  
  const calorieGoal = calculateDailyCalories(
    profile.weight_kg,
    profile.height_cm,
    age,
    profile.gender || "female",
    settings.activity_level,
    settings.primary_focus,
    settings.weekly_weight_goal_kg
  );

  const macros = calculateMacros(calorieGoal, profile.weight_kg);

  return {
    ...macros,
    hasProfile: true,
  };
} 

// @/app/actions/nutrition-goals.ts

export async function getTodayNutrition() {
  const supabase = await createClient(); // Eller din DB-klient
  
  // Hämta alla måltider för idag
  const { data: meals, error } = await supabase
    .from('meal_logs')
    .select('calories, protein_g, carbs_g, fat_g')
    .gte('created_at', new Date().toISOString().split('T')[0]);

  if (error) return { caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0 };

  // Räkna ihop totalen
  const totals = meals.reduce((acc, meal) => ({
    caloriesConsumed: acc.caloriesConsumed + Number(meal.calories || 0),
    proteinConsumed: acc.proteinConsumed + Number(meal.protein_g || 0),
    carbsConsumed: acc.carbsConsumed + Number(meal.carbs_g || 0),
    fatConsumed: acc.fatConsumed + Number(meal.fat_g || 0),
  }), {
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatConsumed: 0,
  });

  return { ...totals, caloriesBurned: 0 }; // Returnera objektet som din sida förväntar sig
}