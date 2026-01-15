-- Create hydration_logs table
create table if not exists hydration_logs (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users not null,
  amount_ml int not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table hydration_logs enable row level security;

-- Policies
create policy "Users can view their own hydration logs"
  on hydration_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own hydration logs"
  on hydration_logs for insert
  with check (auth.uid() = user_id);
