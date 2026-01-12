import { z } from "zod";

// 1. Meal Schema
export const MealSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  calories: z.number().int().positive("Calories must be a positive number"),
  protein: z.number().nonnegative().optional().nullable(), // Optional & can be 0 or null
  type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
});

// 2. Workout Schema
export const WorkoutSchema = z.object({
  // Basic info
  name: z.string().min(1, "Name is required"),
  duration: z.number().int().nonnegative().optional().nullable(),
  calories: z.number().int().nonnegative("Calories must be a positive number").optional().or(z.literal(0)),
  status: z.enum(["planned", "completed"]).optional().default("completed"),

  // New Metrics
  type: z.enum(["strength", "cardio", "flexibility", "other"]).optional().default("strength"),
  reps: z.number().int().nonnegative().optional().nullable(),
  sets: z.number().int().nonnegative().optional().nullable(),
  weight: z.number().nonnegative().optional().nullable(),
  distance: z.number().nonnegative().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// 3. Profile Schema (Complex validation made easy!)
export const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female", "other"]),
  weight: z.number().positive("Weight must be positive"),
  height: z.number().positive("Height must be positive"),
  dateOfBirth: z.string().optional().or(z.literal("")),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ]),
  location: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
});

// 4. Signup Schema
export const SignupSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
