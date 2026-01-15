-- Add new columns for workout metrics
ALTER TABLE workouts 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'strength',
ADD COLUMN IF NOT EXISTS reps integer,
ADD COLUMN IF NOT EXISTS sets integer,
ADD COLUMN IF NOT EXISTS weight float,
ADD COLUMN IF NOT EXISTS distance float,
ADD COLUMN IF NOT EXISTS notes text;
