import { Database } from "./supabase";

// Helper to extract the Row type easily
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];

// Re-export specific types for your app to use
export type Profile = Tables<"profiles">;
export type Workout = Tables<"workouts">;
export type MealLog = Tables<"meal_logs">;
export type DailySummary = Views<"daily_summary">;

// Enums (Auto-extracted from DB)
export type ActivityLevel = Enums<"activity_level_enum">;
export type Gender = Enums<"gender_enum">;
export type MealType = Enums<"meal_type_enum">;
