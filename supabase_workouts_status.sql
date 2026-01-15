-- Add status column to workouts table
-- This allows us to distinguish between 'active' (on dashboard) and 'completed' (in archive) workouts

ALTER TABLE workouts 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Optional: Create an index for faster filtering
CREATE INDEX IF NOT EXISTS idx_workouts_status ON workouts(status);

-- Update any existing records to have a status (just in case)
UPDATE workouts SET status = 'active' WHERE status IS NULL;
