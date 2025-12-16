// frontend/app/actions/profile.ts (Updated)
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ProfileSchema } from "@/lib/schemas";
import { z } from "zod";
import { ActivityLevel, Gender } from "@/types/database";
import { calculateDailyCalories, calculateAge } from "@/utils/bmr";

type ProfileData = z.infer<typeof ProfileSchema>;

export async function updateProfile(data: ProfileData) {
  // 1. Validate
  const validation = ProfileSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const age = calculateAge(data.dateOfBirth);
  const calculatedGoal = calculateDailyCalories(
    data.weight,
    data.height,
    age,
    data.gender as Gender,
    data.activityLevel as ActivityLevel
  );

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      gender: data.gender,
      weight_kg: data.weight,
      height_cm: data.height,
      date_of_birth: data.dateOfBirth,
      activity_level: data.activityLevel,
      daily_calorie_goal: calculatedGoal,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
