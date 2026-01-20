-- Add specific goal columns to user_settings table
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS strength_goal_days integer DEFAULT 3,
ADD COLUMN IF NOT EXISTS cardio_goal_minutes integer DEFAULT 120;
