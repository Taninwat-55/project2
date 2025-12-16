"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Define the data shape you expect from the Frontend team
type WorkoutData = {
  name: string;
  duration: number;
  calories: number;
  status: "planned" | "completed";
};

export async function logWorkout(data: WorkoutData) {
  const supabase = await createClient();

  // 1. Security Check: Get the user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 2. Database Logic: Insert the workout
  const { error } = await supabase.from("workouts").insert({
    user_id: user.id,
    name: data.name,
    duration_minutes: data.duration,
    calories_burned: data.calories,
    status: data.status,
    performed_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // 3. Update UI: Tell Next.js to refresh the dashboard data
  revalidatePath("/dashboard");

  return { success: true };
}
