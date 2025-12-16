export type Gender = "male" | "female" | "other";
export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Profile {
  id: string; // references auth.users
  first_name: string | null;
  last_name: string | null;
  gender: Gender | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: ActivityLevel | null;
  daily_calorie_goal: number | null;
  created_at: string;
}

export interface MealLog {
  id: string;
  user_id: string;
  name: string;
  meal_type: MealType;
  calories: number;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  eaten_at: string; // Date string (YYYY-MM-DD)
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  status: string;
  duration_minutes: number | null;
  calories_burned: number | null;
  performed_at: string; // ISO Timestamp
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_name: string;
  sets: number | null;
  reps: number | null;
  weight_kg: number | null;
  created_at: string;
}
