-- ============================================
-- FIX: Update profile_completed for existing users
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. First, let's check the current RLS policies on profiles
SELECT 
    policyname, 
    cmd, 
    qual::text as using_expression,
    with_check::text as with_check_expression
FROM pg_policies 
WHERE tablename = 'profiles';

-- 2. Fix all existing profiles that have required data but profile_completed = false
UPDATE profiles 
SET profile_completed = TRUE 
WHERE 
    first_name IS NOT NULL 
    AND last_name IS NOT NULL
    AND gender IS NOT NULL
    AND weight_kg IS NOT NULL 
    AND height_cm IS NOT NULL 
    AND activity_level IS NOT NULL
    AND profile_completed = FALSE;

-- 3. See how many were updated
-- (Run separately to check results)
SELECT 
    id, 
    first_name, 
    last_name, 
    profile_completed,
    CASE 
        WHEN first_name IS NOT NULL AND last_name IS NOT NULL AND gender IS NOT NULL 
             AND weight_kg IS NOT NULL AND height_cm IS NOT NULL AND activity_level IS NOT NULL
        THEN 'Complete'
        ELSE 'Incomplete'
    END as data_status
FROM profiles;

-- 4. Ensure RLS allows users to update their own profile_completed field
-- First check if there's a restrictive policy
-- If needed, run this to ensure proper update policy:

-- DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- CREATE POLICY "Users can update own profile." 
-- ON profiles FOR UPDATE
-- USING (auth.uid() = id)
-- WITH CHECK (auth.uid() = id);
