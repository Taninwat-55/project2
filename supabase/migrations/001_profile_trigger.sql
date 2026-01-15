-- ============================================
-- Supabase Profile Auto-Creation Trigger
-- ============================================
-- Run this in the Supabase SQL Editor:
-- Dashboard > SQL Editor > New Query > Paste & Run

-- 1. Create the function that will be called on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  full_name_raw TEXT;
  first_name_val TEXT;
  last_name_val TEXT;
BEGIN
  -- Extract full_name from the user metadata (passed during signup)
  full_name_raw := NEW.raw_user_meta_data->>'full_name';
  
  -- Split the full name into first and last name
  IF full_name_raw IS NOT NULL AND full_name_raw != '' THEN
    first_name_val := SPLIT_PART(full_name_raw, ' ', 1);
    last_name_val := NULLIF(TRIM(SUBSTRING(full_name_raw FROM POSITION(' ' IN full_name_raw) + 1)), '');
  ELSE
    first_name_val := NULL;
    last_name_val := NULL;
  END IF;

  -- Insert a new row into the profiles table
  INSERT INTO public.profiles (id, first_name, last_name, created_at, updated_at)
  VALUES (
    NEW.id,
    first_name_val,
    last_name_val,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger that fires after a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Done! New signups will now auto-create profiles.
-- ============================================
