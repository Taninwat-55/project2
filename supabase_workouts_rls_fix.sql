-- ============================================
-- FIX: Add UPDATE and DELETE RLS policies for workouts table
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Check existing policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'workouts';

-- 2. Add UPDATE policy (allows users to update their own workouts)
CREATE POLICY "Users can update own workouts"
ON workouts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Add DELETE policy (allows users to delete their own workouts)
CREATE POLICY "Users can delete own workouts"
ON workouts FOR DELETE
USING (auth.uid() = user_id);

-- 4. Verify policies are created
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'workouts';
