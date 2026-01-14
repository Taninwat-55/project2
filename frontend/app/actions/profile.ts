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

  let age = 25; // Default age if not provided
  if (data.dateOfBirth && !isNaN(Date.parse(data.dateOfBirth))) {
    age = calculateAge(data.dateOfBirth);
  }

  const calculatedGoal = calculateDailyCalories(
    data.weight,
    data.height,
    age,
    data.gender as Gender,
    data.activityLevel as ActivityLevel
  );

  console.log('[updateProfile] Attempting to update profile for user:', user.id);
  console.log('[updateProfile] Data being sent:', {
    first_name: data.firstName,
    last_name: data.lastName,
    gender: data.gender,
    weight_kg: data.weight,
    height_cm: data.height,
    date_of_birth: data.dateOfBirth ? data.dateOfBirth : null,
    activity_level: data.activityLevel,
    daily_calorie_goal: calculatedGoal,
    profile_completed: true,
  });

  const { error, count } = await supabase
    .from("profiles")
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      gender: data.gender,
      weight_kg: data.weight,
      height_cm: data.height,
      date_of_birth: data.dateOfBirth ? data.dateOfBirth : null,
      activity_level: data.activityLevel,
      daily_calorie_goal: calculatedGoal,
      location: data.location,
      phone: data.phone,
      avatar_url: data.avatarUrl,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  console.log('[updateProfile] Update result - error:', error, 'count:', count);

  if (error) {
    console.error('[updateProfile] Update failed:', error.message);
    return { success: false, error: error.message };
  }

  // Update user metadata to cache profile completion status
  // This reduces database queries in middleware
  const { error: metadataError } = await supabase.auth.updateUser({
    data: { profile_completed: true }
  });

  // Log metadata update failure but don't fail the overall operation
  // The profile is still marked as complete in the database
  if (metadataError) {
    console.error('Failed to update user metadata:', metadataError);
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { success: true };
}

export async function updateEmail(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updatePassword(password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
