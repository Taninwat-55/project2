"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface WeightLogEntry {
    date: string;
    weight: number;
}

export interface StrengthProgressEntry {
    date: string;
    exercise: string;
    maxWeight: number;
}

/**
 * Get weight history for charting
 * @param months Number of months to fetch (default: all)
 */
export async function getWeightHistory(months?: number): Promise<WeightLogEntry[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    let query = supabase
        .from("weight_logs")
        .select("weight_kg, logged_at")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: true });

    // Filter by date range if months specified
    if (months) {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);
        query = query.gte("logged_at", startDate.toISOString());
    }

    const { data, error } = await query;

    if (error || !data) {
        console.error("Error fetching weight history:", error);
        return [];
    }

    return data.map(entry => ({
        date: new Date(entry.logged_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }),
        weight: entry.weight_kg
    }));
}

/**
 * Get strength progress over time (max weight per exercise)
 * Uses workout_exercises table data
 * @param months Number of months to fetch (default: all)
 */
export async function getStrengthProgress(months?: number): Promise<StrengthProgressEntry[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // First get workouts for this user
    let workoutsQuery = supabase
        .from("workouts")
        .select("id, performed_at")
        .eq("user_id", user.id);

    if (months) {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);
        workoutsQuery = workoutsQuery.gte("performed_at", startDate.toISOString());
    }

    const { data: workouts, error: workoutsError } = await workoutsQuery;

    if (workoutsError || !workouts || workouts.length === 0) {
        return [];
    }

    const workoutIds = workouts.map(w => w.id);
    const workoutDates = new Map(workouts.map(w => [w.id, w.performed_at]));

    // Fetch exercises for these workouts
    const { data: exercises, error: exercisesError } = await supabase
        .from("workout_exercises")
        .select("workout_id, exercise_name, weight_kg")
        .in("workout_id", workoutIds)
        .not("weight_kg", "is", null)
        .order("created_at", { ascending: true });

    if (exercisesError || !exercises) {
        console.error("Error fetching exercises:", exercisesError);
        return [];
    }

    // Map to track max weight per exercise per date
    const progressMap = new Map<string, { exercise: string; maxWeight: number; date: string }>();

    exercises.forEach(ex => {
        const performedAt = workoutDates.get(ex.workout_id);
        if (!performedAt) return;

        const dateStr = new Date(performedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        const key = `${ex.exercise_name}-${dateStr}`;

        const existing = progressMap.get(key);
        if (!existing || ex.weight_kg > existing.maxWeight) {
            progressMap.set(key, {
                exercise: ex.exercise_name,
                maxWeight: ex.weight_kg,
                date: dateStr
            });
        }
    });

    return Array.from(progressMap.values());
}

/**
 * Log a new weight entry
 */
export async function logWeight(weightKg: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "User not authenticated" };
    }

    if (weightKg <= 0 || weightKg > 500) {
        return { success: false, error: "Invalid weight value" };
    }

    const { error } = await supabase.from("weight_logs").insert({
        user_id: user.id,
        weight_kg: weightKg,
        logged_at: new Date().toISOString()
    });

    if (error) {
        return { success: false, error: error.message };
    }

    // Also update the profile's current weight
    await supabase
        .from("profiles")
        .update({ weight_kg: weightKg })
        .eq("id", user.id);

    revalidatePath("/progress");
    return { success: true };
}

/**
 * Get user's current weight from profile
 */
export async function getCurrentWeight(): Promise<number | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
        .from("profiles")
        .select("weight_kg")
        .eq("id", user.id)
        .single();

    return data?.weight_kg || null;
}
