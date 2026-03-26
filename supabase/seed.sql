insert into public.clinics (
  id,
  name,
  slug,
  tagline,
  description,
  primary_color,
  secondary_color,
  font_family,
  phone,
  whatsapp,
  email,
  address,
  latitude,
  longitude,
  emergency_banner_enabled,
  emergency_message,
  show_reviews,
  show_pricing,
  booking_enabled,
  buffer_minutes,
  operating_hours,
  social_links
)
values (
  '11111111-1111-1111-1111-111111111111',
  'MedBook Pro Demo Clinic',
  'medbook-pro-demo',
  'Modern care coordination for busy urban clinics.',
  'Demo clinic seed for local development and frontend integration.',
  '#0f766e',
  '#fb923c',
  'Manrope',
  '+1 (415) 555-0148',
  '+14155550148',
  'care@medbookpro.demo',
  '1250 Valencia Street, San Francisco, CA 94110',
  37.7597,
  -122.4214,
  true,
  'Urgent case? Call the clinic hotline for same-day guidance.',
  true,
  true,
  true,
  5,
  '{
    "Monday": { "label": "Mon", "open": "08:00", "close": "18:00" },
    "Tuesday": { "label": "Tue", "open": "08:00", "close": "18:00" },
    "Wednesday": { "label": "Wed", "open": "08:00", "close": "18:00" },
    "Thursday": { "label": "Thu", "open": "08:00", "close": "18:00" },
    "Friday": { "label": "Fri", "open": "08:00", "close": "18:00" },
    "Saturday": { "label": "Sat", "open": "09:00", "close": "14:00" },
    "Sunday": { "label": "Sun", "open": "00:00", "close": "00:00", "closed": true }
  }'::jsonb,
  '{
    "facebook": "https://facebook.com",
    "instagram": "https://instagram.com",
    "linkedin": "https://linkedin.com"
  }'::jsonb
)
on conflict (id) do nothing;

insert into public.doctors (
  id,
  clinic_id,
  name,
  title,
  specialization,
  qualifications,
  bio,
  consultation_duration,
  is_active,
  display_order,
  available_slots
)
values
(
  '22222222-2222-2222-2222-222222222221',
  '11111111-1111-1111-1111-111111111111',
  'Alicia Ward',
  'Dr.',
  'Cardiology',
  'MD, FACC',
  'Focuses on preventive cardiology, hypertension management, and post-operative follow-ups.',
  30,
  true,
  1,
  '{"Monday":["09:00","09:35","10:10"],"Wednesday":["09:00","09:35","10:10"],"Friday":["09:00","09:35","10:10"]}'::jsonb
),
(
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Mason Lee',
  'Dr.',
  'Dermatology',
  'MBBS, MSc Dermatology',
  'Specializes in chronic skin conditions, tele-derm follow-up care, and rapid diagnostics.',
  20,
  true,
  2,
  '{"Tuesday":["10:00","10:25","10:50"],"Thursday":["10:00","10:25","10:50"],"Saturday":["09:30","09:55","10:20"]}'::jsonb
)
on conflict (id) do nothing;

insert into public.services (
  id,
  clinic_id,
  name,
  description,
  duration_minutes,
  price,
  icon,
  is_active,
  display_order
)
values
(
  '33333333-3333-3333-3333-333333333331',
  '11111111-1111-1111-1111-111111111111',
  'Cardiac Consultation',
  'Screening, diagnosis, and long-term cardiac care planning.',
  30,
  120,
  'HeartPulse',
  true,
  1
),
(
  '33333333-3333-3333-3333-333333333332',
  '11111111-1111-1111-1111-111111111111',
  'Skin Review',
  'Acne, eczema, rash, and lesion consultation with treatment plan.',
  20,
  90,
  'ScanSearch',
  true,
  2
)
on conflict (id) do nothing;

-- Set VITE_CLINIC_ID=11111111-1111-1111-1111-111111111111 in .env when you want
-- the frontend to target this seeded clinic from live Supabase-backed queries.
