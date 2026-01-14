-- Profile Completion Flag
-- Run this migration in your Supabase SQL editor

-- Add profile_completed column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- Update existing profiles that have required fields filled to be marked as completed
-- This ensures existing users with complete profiles don't get blocked
UPDATE profiles 
SET profile_completed = TRUE 
WHERE first_name IS NOT NULL 
  AND weight_kg IS NOT NULL 
  AND height_cm IS NOT NULL 
  AND date_of_birth IS NOT NULL 
  AND activity_level IS NOT NULL;
