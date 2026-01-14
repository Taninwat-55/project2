-- Weight Logs Table for Progress Tracking
-- Run this migration in your Supabase SQL editor

-- Create the weight_logs table
CREATE TABLE IF NOT EXISTS weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  weight_kg FLOAT NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries by user and date
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date 
ON weight_logs(user_id, logged_at DESC);

-- Enable Row Level Security
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own weight logs
CREATE POLICY "Users can view their own weight logs"
ON weight_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight logs"
ON weight_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight logs"
ON weight_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight logs"
ON weight_logs FOR DELETE
USING (auth.uid() = user_id);
