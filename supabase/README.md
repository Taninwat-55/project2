# Supabase Database Migrations

This folder contains SQL migrations for the Supabase database. Run these in order using the Supabase SQL Editor.

## Migration Files

| Order | File | Description |
|-------|------|-------------|
| 1 | `001_profile_trigger.sql` | Creates trigger to auto-create profile on user signup |
| 2 | `002_profile_updates.sql` | Adds avatar_url, location, phone columns + storage policies |
| 3 | `003_profile_completed.sql` | Adds profile_completed flag to profiles table |
| 4 | `004_workouts_updates.sql` | Adds type, reps, sets, weight, distance, notes to workouts |
| 5 | `005_nutrition.sql` | Creates meal_logs table and RLS policies |
| 6 | `006_hydration.sql` | Creates hydration_logs table for water tracking |
| 7 | `007_weight_logs.sql` | Creates weight_logs table for body weight tracking |
| 8 | `008_fix_profile_completed.sql` | One-time fix for existing users' profile_completed status |

## How to Run

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste each file's contents in order
4. Click **Run** to execute

> ⚠️ **Important**: Run migrations in numerical order. Some depend on previous ones.

## Adding New Migrations

When creating a new migration:
1. Use the next number in sequence (e.g., `009_your_feature.sql`)
2. Include a descriptive name
3. Add comments in the SQL file explaining what it does
4. Update this README with the new migration
