create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_name text not null,
  phone text not null,
  email text,
  subject text not null,
  message text not null check (char_length(trim(message)) >= 10),
  status text not null default 'new' check (status in ('new', 'read', 'resolved')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_contact_messages_clinic_status_created
on public.contact_messages(clinic_id, status, created_at desc);

drop trigger if exists set_contact_messages_updated_at on public.contact_messages;
create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

alter table public.contact_messages enable row level security;

drop policy if exists "authenticated contact messages full access" on public.contact_messages;
create policy "authenticated contact messages full access"
on public.contact_messages
for all
to authenticated
using (true)
with check (true);

drop policy if exists "anon contact messages insert" on public.contact_messages;
create policy "anon contact messages insert"
on public.contact_messages
for insert
to anon
with check (
  char_length(trim(patient_name)) > 0
  and char_length(trim(phone)) > 0
  and char_length(trim(subject)) > 0
  and char_length(trim(message)) >= 10
);
