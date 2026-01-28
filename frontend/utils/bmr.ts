import { ActivityLevel, Gender } from "@/types/database";

// Mifflin-St Jeor Equation with Weight Goal Adjustments
export function calculateDailyCalories(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel,
  primaryFocus?: string,
  weeklyGoalKg?: number
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

  const maintenance = Math.round(bmr * (multipliers[activityLevel] || 1.2));

  // Weight goal adjustment (if provided)
  // 0.5kg per week = ~500 kcal deficit/surplus per day (7700 kcal per kg / 7 days ≈ 1100, but we use 600 for safety)
  if (primaryFocus && weeklyGoalKg !== undefined) {
    const dailyAdjustment = Math.abs(weeklyGoalKg) * 600;

    if (primaryFocus === "weight_loss") {
      return Math.round(maintenance - dailyAdjustment);
    } else if (primaryFocus === "weight_gain") {
      return Math.round(maintenance + dailyAdjustment);
    }
  }

  return maintenance;
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
