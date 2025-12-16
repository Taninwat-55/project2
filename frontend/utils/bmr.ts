// frontend/utils/bmr.ts
import { ActivityLevel, Gender } from "@/types/database";

// Mifflin-St Jeor Equation
export function calculateDailyCalories(
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

export function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
