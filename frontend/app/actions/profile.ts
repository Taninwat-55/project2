"use server";

import { createClient } from "@/utils/supabase/server";
import { ActivityLevel, Gender } from "@/types/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Define the input shape for the form
type ProfileData = {
  firstName: string;
  lastName: string;
  gender: Gender;
  weight: number;
  height: number;
  dateOfBirth: string;
  activityLevel: ActivityLevel;
};

// 1. Helper function to calculate BMR (Mifflin-St Jeor Equation)
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

// 2. The Server Action
export async function updateProfile(data: ProfileData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // Calculate the magic number
  const age = calculateAge(data.dateOfBirth);
  const calculatedGoal = calculateDailyCalories(
    data.weight,
    data.height,
    age,
    data.gender,
    data.activityLevel
  );

  // Update Supabase
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
      daily_calorie_goal: calculatedGoal, // <--- Auto-calculated!
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
