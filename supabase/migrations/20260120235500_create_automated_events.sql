-- Create table for automated events (Happening Now)
create table if not exists public.automated_events (
    id uuid default gen_random_uuid() primary key,
    type text not null check (type in ('plan_completed', 'goal_reached', 'new_user', 'system_milestone')),
    municipality text not null,
    title text not null,
    details text,
    image_gradient text not null,
    likes integer default 0,
    footer_context text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.automated_events enable row level security;

-- Policy: Everyone can view events
create policy "Everyone can view automated events"
    on public.automated_events for select
    using (true);

-- Policy: Authenticated users can insert events (via service role or backend triggers mostly, but allowing auth users for now as we invoke from client service)
create policy "Authenticated users can create automated events"
    on public.automated_events for insert
    with check (auth.role() = 'authenticated');

-- Policy: Authenticated users can update likes (simplified for now)
create policy "Authenticated users can update likes"
    on public.automated_events for update
    using (auth.role() = 'authenticated');
