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

export async function getNutritionGoals(): Promise<NutritionGoals> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { ...DEFAULT_GOALS, hasProfile: false };

    const { data: profile } = await supabase
        .from("profiles")
        .select("daily_calorie_goal, weight_kg, height_cm, gender, activity_level, date_of_birth")
        .eq("id", user.id)
        .single();

    if (!profile) return { ...DEFAULT_GOALS, hasProfile: false };

    let calorieGoal = profile.daily_calorie_goal;

    if (!calorieGoal && profile.weight_kg && profile.height_cm && profile.gender && profile.activity_level) {
        let age = 25;
        if (profile.date_of_birth) age = calculateAge(profile.date_of_birth);

        calorieGoal = calculateDailyCalories(
            profile.weight_kg,
            profile.height_cm,
            age,
            profile.gender as Gender,
            profile.activity_level as ActivityLevel
        );
    }

    if (!calorieGoal) return { ...DEFAULT_GOALS, hasProfile: true };

    const macros = calculateMacroGoals(calorieGoal, profile.weight_kg);
    return { ...macros, hasProfile: true };
}


export async function getTodayNutrition(): Promise<TodayNutrition> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0 };
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const { data: meals, error } = await supabase
        .from("meal_logs")
        .select("calories, protein_g, carbs_g, fat_g")
        .eq("user_id", user.id)
        .gte("created_at", startOfToday.toISOString());

    if (error) {
        console.error("Error fetching today's meals:", error);
        return { caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0 };
    }

    if (!meals || meals.length === 0) {
        return { caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0 };
    }

    return meals.reduce(
        (acc, meal) => ({
            caloriesConsumed: acc.caloriesConsumed + (Number(meal.calories) || 0),
            proteinConsumed: acc.proteinConsumed + (Number(meal.protein_g) || 0),
            carbsConsumed: acc.carbsConsumed + (Number(meal.carbs_g) || 0),
            fatConsumed: acc.fatConsumed + (Number(meal.fat_g) || 0),
        }),
        { caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0 }
    );
}