create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'appointment_status'
  ) then
    create type public.appointment_status as enum (
      'pending',
      'confirmed',
      'cancelled',
      'completed',
      'no_show'
    );
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  description text,
  logo_url text,
  hero_image_url text,
  primary_color text not null default '#0f766e',
  secondary_color text not null default '#fb923c',
  font_family text not null default 'Manrope',
  phone text,
  whatsapp text,
  email text,
  address text,
  latitude double precision,
  longitude double precision,
  operating_hours jsonb not null default '{}'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  emergency_banner_enabled boolean not null default false,
  emergency_message text,
  show_reviews boolean not null default true,
  show_pricing boolean not null default true,
  booking_enabled boolean not null default true,
  buffer_minutes integer not null default 5 check (buffer_minutes >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  title text,
  specialization text not null,
  qualifications text,
  bio text,
  photo_url text,
  available_slots jsonb not null default '{}'::jsonb,
  consultation_duration integer not null default 30 check (consultation_duration > 0),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null check (duration_minutes > 0),
  price numeric(10, 2) not null default 0,
  icon text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  date_of_birth date,
  gender text,
  address text,
  total_visits integer not null default 0 check (total_visits >= 0),
  last_visit date,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  doctor_id uuid references public.doctors(id) on delete cascade,
  blocked_date date not null,
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (start_time is null or end_time is null or start_time < end_time)
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  patient_id uuid not null references public.patients(id) on delete cascade,
  reference_number text not null unique,
  date date not null,
  start_time time not null,
  end_time time not null,
  status public.appointment_status not null default 'pending',
  notes text,
  confirmation_sent boolean not null default false,
  reminder_sent boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (start_time < end_time)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null check (char_length(trim(comment)) >= 10),
  is_approved boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete restrict,
  file_url text not null,
  file_name text not null,
  file_type text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_doctors_clinic_id on public.doctors(clinic_id);
create index if not exists idx_services_clinic_id on public.services(clinic_id);
create index if not exists idx_patients_clinic_id on public.patients(clinic_id);
create index if not exists idx_appointments_clinic_date on public.appointments(clinic_id, date);
create index if not exists idx_appointments_doctor_date on public.appointments(doctor_id, date, start_time);
create index if not exists idx_appointments_patient_id on public.appointments(patient_id);
create unique index if not exists uniq_appointments_doctor_slot on public.appointments(doctor_id, date, start_time);
create index if not exists idx_reviews_clinic_id on public.reviews(clinic_id, is_approved, is_featured);
create index if not exists idx_prescriptions_patient_id on public.prescriptions(patient_id);
create index if not exists idx_blocked_slots_clinic_date on public.blocked_slots(clinic_id, blocked_date);

create unique index if not exists uniq_doctor_order_per_clinic on public.doctors(clinic_id, display_order);
create unique index if not exists uniq_service_order_per_clinic on public.services(clinic_id, display_order);

drop trigger if exists set_clinics_updated_at on public.clinics;
create trigger set_clinics_updated_at
before update on public.clinics
for each row execute function public.set_updated_at();

drop trigger if exists set_doctors_updated_at on public.doctors;
create trigger set_doctors_updated_at
before update on public.doctors
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_patients_updated_at on public.patients;
create trigger set_patients_updated_at
before update on public.patients
for each row execute function public.set_updated_at();

drop trigger if exists set_blocked_slots_updated_at on public.blocked_slots;
create trigger set_blocked_slots_updated_at
before update on public.blocked_slots
for each row execute function public.set_updated_at();

drop trigger if exists set_appointments_updated_at on public.appointments;
create trigger set_appointments_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

drop trigger if exists set_prescriptions_updated_at on public.prescriptions;
create trigger set_prescriptions_updated_at
before update on public.prescriptions
for each row execute function public.set_updated_at();

create or replace function public.sync_patient_visit_stats()
returns trigger
language plpgsql
as $$
declare
  target_patient_id uuid;
begin
  target_patient_id := coalesce(new.patient_id, old.patient_id);

  update public.patients
  set
    total_visits = (
      select count(*)
      from public.appointments a
      where a.patient_id = target_patient_id
        and a.status in ('confirmed', 'completed', 'pending')
    ),
    last_visit = (
      select max(a.date)
      from public.appointments a
      where a.patient_id = target_patient_id
        and a.status in ('confirmed', 'completed', 'pending')
    )
  where id = target_patient_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists sync_patient_visit_stats_on_appointments on public.appointments;
create trigger sync_patient_visit_stats_on_appointments
after insert or update or delete on public.appointments
for each row execute function public.sync_patient_visit_stats();

alter table public.clinics enable row level security;
alter table public.doctors enable row level security;
alter table public.services enable row level security;
alter table public.patients enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.appointments enable row level security;
alter table public.reviews enable row level security;
alter table public.prescriptions enable row level security;

drop policy if exists "authenticated clinics full access" on public.clinics;
create policy "authenticated clinics full access"
on public.clinics
for all
to authenticated
using (true)
with check (true);

drop policy if exists "anon clinics read" on public.clinics;
create policy "anon clinics read"
on public.clinics
for select
to anon
using (true);

drop policy if exists "authenticated doctors full access" on public.doctors;
create policy "authenticated doctors full access"
on public.doctors
for all
to authenticated
using (true)
with check (true);

drop policy if exists "anon doctors read active" on public.doctors;
create policy "anon doctors read active"
on public.doctors
for select
to anon
using (is_active = true);

drop policy if exists "authenticated services full access" on public.services;
create policy "authenticated services full access"
on public.services
for all
to authenticated
using (true)
with check (true);

drop policy if exists "anon services read active" on public.services;
create policy "anon services read active"
on public.services
for select
to anon
using (is_active = true);

drop policy if exists "authenticated patients full access" on public.patients;
create policy "authenticated patients full access"
on public.patients
for all
to authenticated
using (true)
with check (true);

drop policy if exists "anon patients insert" on public.patients;
create policy "anon patients insert"
on public.patients
for insert
to anon
with check (
  clinic_id is not null
  and char_length(trim(name)) > 0
  and char_length(trim(phone)) > 0
);

drop policy if exists "authenticated blocked slots full access" on public.blocked_slots;
create policy "authenticated blocked slots full access"
on public.blocked_slots
for all
to authenticated
using (true)
with check (true);

drop policy if exists "anon blocked slots read" on public.blocked_slots;
create policy "anon blocked slots read"
on public.blocked_slots
for select
to anon
using (true);

drop policy if exists "authenticated appointments full access" on public.appointments;
create policy "authenticated appointments full access"
on public.appointments
for all
to authenticated
using (true)
with check (true);

drop policy if exists "anon appointments insert" on public.appointments;
create policy "anon appointments insert"
on public.appointments
for insert
to anon
with check (
  exists (
    select 1
    from public.patients p
    where p.id = patient_id
      and p.clinic_id = clinic_id
  )
  and
  exists (
    select 1
    from public.doctors d
    where d.id = doctor_id
      and d.clinic_id = clinic_id
      and d.is_active = true
  )
  and exists (
    select 1
    from public.services s
    where s.id = service_id
      and s.clinic_id = clinic_id
      and s.is_active = true
  )
  and end_time > start_time
);

drop policy if exists "authenticated reviews full access" on public.reviews;
create policy "authenticated reviews full access"
on public.reviews
for all
to authenticated
using (true)
with check (true);

drop policy if exists "anon reviews read approved" on public.reviews;
create policy "anon reviews read approved"
on public.reviews
for select
to anon
using (is_approved = true);

drop policy if exists "anon reviews insert" on public.reviews;
create policy "anon reviews insert"
on public.reviews
for insert
to anon
with check (
  rating between 1 and 5
  and char_length(trim(comment)) >= 10
);

drop policy if exists "authenticated prescriptions full access" on public.prescriptions;
create policy "authenticated prescriptions full access"
on public.prescriptions
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'prescriptions',
  'prescriptions',
  false,
  10485760,
  array['application/pdf', 'image/png', 'image/jpeg']
)
on conflict (id) do nothing;

drop policy if exists "authenticated prescription objects read" on storage.objects;
create policy "authenticated prescription objects read"
on storage.objects
for select
to authenticated
using (bucket_id = 'prescriptions');

drop policy if exists "authenticated prescription objects write" on storage.objects;
create policy "authenticated prescription objects write"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'prescriptions');

drop policy if exists "authenticated prescription objects update" on storage.objects;
create policy "authenticated prescription objects update"
on storage.objects
for update
to authenticated
using (bucket_id = 'prescriptions')
with check (bucket_id = 'prescriptions');

drop policy if exists "authenticated prescription objects delete" on storage.objects;
create policy "authenticated prescription objects delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'prescriptions');
