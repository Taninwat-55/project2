"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { WorkoutSchema } from "@/lib/schemas";
import { z } from "zod";

type WorkoutData = z.infer<typeof WorkoutSchema>;

export async function logWorkout(data: WorkoutData) {
  // 1. Validate
  const validation = WorkoutSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const { error } = await supabase.from("workouts").insert({
    user_id: user.id,
    name: data.name,
    duration_minutes: data.duration ?? 0, // Default to 0 if not provided
    calories_burned: data.calories,
    status: data.status,
    type: data.type,
    reps: data.reps,
    sets: data.sets,
    weight: data.weight,
    distance: data.distance,
    notes: data.notes,
    performed_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/workouts");
  return { success: true };
}

export async function getUserWorkouts(limit: number = 20) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("performed_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }

  return data.map(workout => ({
    id: workout.id,
    title: workout.name,
    duration: `${workout.duration_minutes} min`,
    calories: `${workout.calories_burned} kcal`,
    day: new Date(workout.performed_at).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    date: workout.performed_at,
    // New fields for details
    type: workout.type,
    metrics: {
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
      distance: workout.distance
    }
  }));
}

export async function getWorkoutStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { thisWeek: 0, calories: '0', activeMinutes: '0' };

  // Get start of current week (Monday)
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Fetch all workouts for stats (in a real app, might want to aggregate in SQL)
  const { data, error } = await supabase
    .from("workouts")
    .select("duration_minutes, calories_burned, performed_at")
    .eq("user_id", user.id);

  if (error || !data) return { thisWeek: 0, calories: '0', activeMinutes: '0' };

  let thisWeekCount = 0;
  let totalCalories = 0;
  let totalMinutes = 0;

  data.forEach(w => {
    totalCalories += w.calories_burned || 0;
    totalMinutes += w.duration_minutes || 0;

    if (new Date(w.performed_at) >= startOfWeek) {
      thisWeekCount++;
    }
  });

  return {
    thisWeek: thisWeekCount,
    calories: totalCalories.toLocaleString(),
    activeMinutes: totalMinutes.toLocaleString()
  };
}
