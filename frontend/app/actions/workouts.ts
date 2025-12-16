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
    duration_minutes: data.duration,
    calories_burned: data.calories,
    status: data.status,
    performed_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
