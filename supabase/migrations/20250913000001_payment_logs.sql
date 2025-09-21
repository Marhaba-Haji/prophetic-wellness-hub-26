-- Create payment_logs table for tracking Razorpay payment events
create table if not exists public.payment_logs (
    id uuid default gen_random_uuid() primary key,
    event_type text not null,
    payment_id text,
    amount bigint,
    status text,
    error jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb default '{}'::jsonb
);

-- Add indexes for better query performance
create index if not exists payment_logs_payment_id_idx on public.payment_logs(payment_id);
create index if not exists payment_logs_event_type_idx on public.payment_logs(event_type);
create index if not exists payment_logs_created_at_idx on public.payment_logs(created_at);

-- Set up RLS policies
alter table public.payment_logs enable row level security;

-- Only allow admins to view payment logs
create policy "Allow admins to view payment logs"
    on public.payment_logs
    for select
    to authenticated
    using (auth.uid() in (
        select user_id from public.admin_users
    ));
