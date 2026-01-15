"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { WorkoutSchema } from "@/lib/schemas";
import { z } from "zod";

type WorkoutData = z.infer<typeof WorkoutSchema>;

// ----------------------------------------------------
// 1. SAVE WORKOUT TO ARCHIVE (Moves existing record)
// ----------------------------------------------------
export async function saveToArchive(workout: { 
  id: number; // We need the ID to find the specific record
  title: string; 
  duration: string; 
  calories: string; 
  category?: string; 
  description?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // We simply UPDATE the status of the existing workout.
  // This removes it from getUserWorkouts (active) 
  // and moves it to getArchivedWorkouts (completed)
  const { error } = await supabase
    .from("workouts")
    .update({ 
      status: "completed",
      type: workout.category || "General",
      notes: workout.description
    })
    .eq("id", workout.id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Update error:", error.message);
    return { success: false, error: error.message };
  }

  // Tell Next.js to clear the cache so the list updates immediately
  revalidatePath("/workouts");
  revalidatePath("/archive");
  
  return { success: true };
}

// ----------------------------------------------------
// 2. LOG NEW WORKOUT (ACTIVE)
// ----------------------------------------------------
export async function logWorkout(data: WorkoutData) {
  const validation = WorkoutSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "User not authenticated" };

  const { error } = await supabase.from("workouts").insert({
    user_id: user.id,
    name: data.name,
    duration_minutes: data.duration ?? 0,
    calories_burned: data.calories,
    status: "active", // ✅ Visible on dashboard
    type: data.type,
    reps: data.reps,
    sets: data.sets,
    weight: data.weight,
    distance: data.distance,
    notes: data.notes,
    performed_at: new Date().toISOString(),
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/workouts");
  return { success: true };
}

// ----------------------------------------------------
// 3. GET WORKOUTS (ACTIVE ONLY)
// ----------------------------------------------------
export async function getUserWorkouts(limit: number = 20) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active") // ✅ Only fetch active
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
    day: new Date(workout.performed_at).toLocaleDateString("en-US", {
      weekday: "long", month: "short", day: "numeric",
    }),
    date: workout.performed_at,
    type: workout.type,
    metrics: {
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
      distance: workout.distance,
    },
  }));
}

// ----------------------------------------------------
// 4. GET ARCHIVED WORKOUTS
// ----------------------------------------------------
export async function getArchivedWorkouts(limit: number = 50) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("performed_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  return data.map(workout => ({
    id: workout.id,
    title: workout.name,
    duration: `${workout.duration_minutes} min`,
    calories: `${workout.calories_burned} kcal`,
    date: workout.performed_at,
    type: workout.type,
  }));
}

// ----------------------------------------------------
// 5. GET WORKOUT STATS
// ----------------------------------------------------
export async function getWorkoutStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { thisWeek: 0, calories: "0", activeMinutes: "0" };

  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("workouts")
    .select("duration_minutes, calories_burned, performed_at")
    .eq("user_id", user.id);

  if (error || !data) return { thisWeek: 0, calories: "0", activeMinutes: "0" };

  let thisWeekCount = 0;
  let totalCalories = 0;
  let totalMinutes = 0;

  data.forEach(w => {
    totalCalories += w.calories_burned || 0;
    totalMinutes += w.duration_minutes || 0;
    if (new Date(w.performed_at) >= startOfWeek) thisWeekCount++;
  });

  return {
    thisWeek: thisWeekCount,
    calories: totalCalories.toLocaleString(),
    activeMinutes: totalMinutes.toLocaleString(),
  };
}
// ----------------------------------------------------
// 6. DELETE WORKOUT (Permanent Removal)
// ----------------------------------------------------
export async function deleteWorkout(id: number) {
  console.log("Attempting to delete workout with ID:", id); // Check your terminal for this!
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Not authenticated" };

  const { error, count } = await supabase
    .from("workouts")
    .delete({ count: 'exact' }) // This tells us if a row was actually removed
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Supabase Delete Error:", error.message);
    return { success: false, error: error.message };
  }

  if (count === 0) {
    console.warn("Delete successful but 0 rows were affected. ID might be wrong.");
  }

  // Force all pages to dump their cache and get fresh data
  revalidatePath("/", "layout"); 
  
  return { success: true };
}