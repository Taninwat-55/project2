// 1. User Profile (Matches 'profiles' table)
export interface UserProfile {
  id: string; // UUID from Supabase Auth
  first_name: string | null;
  last_name: string | null;
  gender: "male" | "female" | "other" | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very_active"
    | null;
  daily_calorie_goal: number; // Default 2000
}

// 2. Meal Log (Matches 'meal_logs' table)
export interface MealLog {
  id: string;
  user_id: string;
  name: string; // e.g. "Banana"
  calories: number;
  protein_g?: number; // Optional (?) because it might be null
  carbs_g?: number;
  fat_g?: number;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  eaten_at: string; // Date string (YYYY-MM-DD)
}

// 3. Workout (Matches 'workouts' table)
export interface Workout {
  id: string;
  user_id: string;
  name: string; // e.g. "Upper Body Power"
  status: "planned" | "completed";
  duration_minutes?: number;
  calories_burned?: number;
  performed_at: string; // ISO Timestamp
  exercises?: WorkoutExercise[]; // Optional: Frontend might want the exercises nested inside
}

// 4. Exercise Detail (Matches 'workout_exercises' table)
export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight_kg: number;
}
