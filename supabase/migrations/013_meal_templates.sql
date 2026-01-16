create table meal_templates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  total_kcal int default 0,
  total_protein int default 0,
  total_carbs int default 0,
  total_fat int default 0,
  ingredients jsonb default '[]'::jsonb, -- sparar listan på ingredienser
  created_at timestamp with time zone default now()
);