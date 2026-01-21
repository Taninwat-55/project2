-- Add weekly weight goal column to user_settings table
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS weekly_weight_goal_kg float DEFAULT 0;
