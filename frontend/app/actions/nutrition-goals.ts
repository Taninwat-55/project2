'use server';

import { createClient } from '@/utils/supabase/server';
import { getUserSettings } from './settings';
import { calculateDailyCalories, calculateAge } from '@/utils/bmr';
import { ActivityLevel, Gender } from '@/types/database';

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

/**
 * Hjälpfunktion för att räkna ut makrofördelning.
 * Standardfördelning: Protein (4 kcal/g), Kolhydrater (4 kcal/g), Fett (9 kcal/g).
 */
function calculateMacros(
  calories: number,
  weight: number,
): Omit<NutritionGoals, 'hasProfile'> {
  // Procentuella mål baserat på totalt kaloriintag
  const proteinPercent = 0.21; // 21% Protein
  const fatPercent = 0.32; // 32% Fett
  const carbPercent = 0.47; // 47% Kolhydrater

  return {
    calories: Math.round(calories),
    // Räknar om kalorier till gram för varje makronutrient
    protein: Math.round((calories * proteinPercent) / 4),
    carbs: Math.round((calories * carbPercent) / 4),
    fat: Math.round((calories * fatPercent) / 9),
  };
}

// --- ACTIONS ---

/**
 * Hämtar eller beräknar användarens dagliga näringsmål.
 * Använder Mifflin-St Jeor-formeln (via calculateDailyCalories) för att få fram BMR och TDEE.
 */
export async function getNutritionGoals(): Promise<NutritionGoals> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fallback-värden om användaren inte är inloggad eller saknar profil
  const DEFAULT_VALUES: NutritionGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
    hasProfile: false,
  };

  if (!user) return DEFAULT_VALUES;

  // Hämtar träningsmål och aktivitetsnivå från inställningar
  const settings = await getUserSettings();

  // Hämtar fysisk data från profilen
  const { data: profile } = await supabase
    .from('profiles')
    .select('daily_calorie_goal, weight_kg, height_cm, gender, date_of_birth')
    .eq('id', user.id)
    .single<ProfileData>();

  // Om profil saknas krävs grundläggande data för att beräkna mål
  if (!profile || !profile.weight_kg || !profile.height_cm) {
    return DEFAULT_VALUES;
  }

  const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : 25;

  // Dynamisk beräkning av kalorimål baserat på BMR, aktivitet och mål (t.ex. bulk/cut)
  const calorieGoal = calculateDailyCalories(
    profile.weight_kg,
    profile.height_cm,
    age,
    (profile.gender || 'female') as Gender,
    settings.activity_level as ActivityLevel,
    settings.primary_focus,
    settings.weekly_weight_goal_kg,
  );

  // Baserat på det nya kalorimålet räknas gram-målen för makros ut
  const macros = calculateMacros(calorieGoal, profile.weight_kg);

  return {
    ...macros,
    hasProfile: true,
  };
}

/**
 * Summerar allt användaren har ätit och förbränt under den nuvarande dagen.
 */
export async function getTodayNutrition(): Promise<TodayNutrition> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const emptyData: TodayNutrition = {
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatConsumed: 0,
    caloriesBurned: 0,
  };

  if (!user) return emptyData;

  // Sätter tidsstämpel till midnatt idag för filtrering
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Hämtar alla måltider som loggats sedan midnatt
  const { data: logs } = await supabase
    .from('meal_logs')
    .select('calories, protein_g, carbs_g, fat_g')
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString());

  // Hämtar alla träningspass som utförts sedan midnatt
  const { data: workouts } = await supabase
    .from('workouts')
    .select('calories_burned')
    .eq('user_id', user.id)
    .gte('performed_at', today.toISOString());

  // Summerar kalorier förbrända via träning
  const totalCaloriesBurned =
    workouts?.reduce((acc, w) => acc + (Number(w.calories_burned) || 0), 0) ||
    0;

  if (!logs) {
    return { ...emptyData, caloriesBurned: totalCaloriesBurned };
  }

  // Summerar näringsvärden från alla måltider till ett totalt dagsresultat
  const nutrition = logs.reduce(
    (acc, log) => ({
      caloriesConsumed: acc.caloriesConsumed + (Number(log.calories) || 0),
      proteinConsumed: acc.proteinConsumed + (Number(log.protein_g) || 0),
      carbsConsumed: acc.carbsConsumed + (Number(log.carbs_g) || 0),
      fatConsumed: acc.fatConsumed + (Number(log.fat_g) || 0),
      caloriesBurned: totalCaloriesBurned,
    }),
    { ...emptyData, caloriesBurned: totalCaloriesBurned },
  );

  return nutrition;
}
