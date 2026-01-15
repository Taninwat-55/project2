-- ============================================
-- User Settings Table
-- Stores user preferences for fitness, notifications, privacy, and display
-- ============================================

-- 1. Create the user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Fitness Preferences
  distance_unit text DEFAULT 'kilometers',
  weight_unit text DEFAULT 'kilograms',
  energy_unit text DEFAULT 'calories',
  primary_focus text DEFAULT 'general_fitness',
  weekly_goal integer DEFAULT 4,
  activity_level text DEFAULT 'lightly_active',
  
  -- Notifications
  pause_all_notifications boolean DEFAULT false,
  daily_reminders boolean DEFAULT false,
  goal_completions boolean DEFAULT false,
  weekly_report boolean DEFAULT false,
  friend_requests boolean DEFAULT true,
  challenge_invites boolean DEFAULT true,
  comments_mentions boolean DEFAULT true,
  kudos boolean DEFAULT true,
  
  -- Privacy
  public_profile boolean DEFAULT false,
  share_activity boolean DEFAULT false,
  allow_friend_requests boolean DEFAULT true,
  anonymous_analytics boolean DEFAULT true,
  
  -- Display
  font_size integer DEFAULT 16,
  reduce_motion boolean DEFAULT false,
  high_contrast boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
CREATE POLICY "Users can view own settings"
ON user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
ON user_settings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
ON user_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Create trigger to auto-create settings on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_settings();

-- 5. Create settings for existing users (one-time migration)
INSERT INTO user_settings (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_settings)
ON CONFLICT (user_id) DO NOTHING;
