"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ProfileSchema } from "@/lib/schemas";
import { z } from "zod";
import { ActivityLevel, Gender } from "@/types/database";

type ProfileData = z.infer<typeof ProfileSchema>;

// ... keep your helper functions (calculateDailyCalories, calculateAge) exactly as they were ...
// (I will omit them here to save space, but DO NOT DELETE THEM from your file)

// Helper function to calculate BMR (Mifflin-St Jeor Equation)
function calculateDailyCalories(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel
): number {
  // Base BMR Calculation
  let bmr = 10 * weight + 6.25 * height - 5 * age;

  if (gender === "male") {
    bmr += 5;
  } else {
    bmr -= 161; // Female adjustment
  }

  // Activity Multipliers
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };

  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

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
