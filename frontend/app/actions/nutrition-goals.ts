// frontend/app/actions/nutrition-goals.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { calculateMacroGoals, DEFAULT_GOALS, MacroGoals } from "@/utils/goals";
import { calculateDailyCalories, calculateAge } from "@/utils/bmr";
import { ActivityLevel, Gender } from "@/types/database";

export interface NutritionGoals extends MacroGoals {
    hasProfile: boolean;
}

export interface TodayNutrition {
    caloriesConsumed: number;
    proteinConsumed: number;
    carbsConsumed: number;
    fatConsumed: number;
}

/**
 * Get the user's personalized nutritional goals from their profile
 */
export async function getNutritionGoals(): Promise<NutritionGoals> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { ...DEFAULT_GOALS, hasProfile: false };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("daily_calorie_goal, weight_kg, height_cm, gender, activity_level, date_of_birth")
        .eq("id", user.id)
        .single();

    if (!profile) {
        return { ...DEFAULT_GOALS, hasProfile: false };
    }

    // If calorie goal is already calculated and stored, use it
    let calorieGoal = profile.daily_calorie_goal;

    // If no stored goal, calculate it now
    if (!calorieGoal && profile.weight_kg && profile.height_cm && profile.gender && profile.activity_level) {
        let age = 25; // Default
        if (profile.date_of_birth) {
            age = calculateAge(profile.date_of_birth);
        }

        calorieGoal = calculateDailyCalories(
            profile.weight_kg,
            profile.height_cm,
            age,
            profile.gender as Gender,
            profile.activity_level as ActivityLevel
        );
    }

    // Fall back to default if still no goal
    if (!calorieGoal) {
        return { ...DEFAULT_GOALS, hasProfile: true };
    }

    const macros = calculateMacroGoals(calorieGoal, profile.weight_kg);
    return { ...macros, hasProfile: true };
}

/**
 * Get today's nutrition consumption from meal logs
 */
export async function getTodayNutrition(): Promise<TodayNutrition> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0 };
    }

    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    const { data: meals } = await supabase
        .from("meal_logs")
        .select("calories, protein_g, carbs_g, fat_g")
        .eq("user_id", user.id)
        .gte("eaten_at", `${today}T00:00:00`)
        .lt("eaten_at", `${today}T23:59:59`);

    if (!meals || meals.length === 0) {
        return { caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0 };
    }

    return meals.reduce(
        (acc, meal) => ({
            caloriesConsumed: acc.caloriesConsumed + (meal.calories || 0),
            proteinConsumed: acc.proteinConsumed + (meal.protein_g || 0),
            carbsConsumed: acc.carbsConsumed + (meal.carbs_g || 0),
            fatConsumed: acc.fatConsumed + (meal.fat_g || 0),
        }),
        { caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0 }
    );
}
