-- ============================================
-- Workout Exercises Table
-- Stores individual exercises within a workout
-- ============================================

-- 1. Create the workout_exercises table
CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_name text NOT NULL,
  sets integer,
  reps integer,
  weight_kg numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Users can view exercises for their own workouts
CREATE POLICY "Users can view own workout exercises"
ON workout_exercises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  )
);

-- Users can insert exercises for their own workouts
CREATE POLICY "Users can insert own workout exercises"
ON workout_exercises FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  )
);

-- Users can update exercises for their own workouts
CREATE POLICY "Users can update own workout exercises"
ON workout_exercises FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  )
);

-- Users can delete exercises for their own workouts
CREATE POLICY "Users can delete own workout exercises"
ON workout_exercises FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  )
);

-- 4. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);
