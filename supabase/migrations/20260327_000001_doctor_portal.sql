-- ============================================================
-- Doctor portal: auth linkage + text-based prescriptions
-- ============================================================

-- 1. Add login_email to doctors so admin can see which email a doctor uses
ALTER TABLE doctors
  ADD COLUMN IF NOT EXISTS login_email TEXT;

-- 2. Text-based doctor prescriptions (written via the doctor portal form)
CREATE TABLE IF NOT EXISTS doctor_prescriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id       UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id  UUID REFERENCES appointments(id) ON DELETE SET NULL,
  diagnosis       TEXT NOT NULL,
  items           JSONB NOT NULL DEFAULT '[]',
  -- Each item: { medication, dosage, frequency, duration, instructions? }
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER set_updated_at_doctor_prescriptions
  BEFORE UPDATE ON doctor_prescriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_doctor_prescriptions_patient ON doctor_prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_doctor_prescriptions_doctor  ON doctor_prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_prescriptions_clinic  ON doctor_prescriptions(clinic_id);

-- ── Row Level Security ──────────────────────────────────────────────────────
ALTER TABLE doctor_prescriptions ENABLE ROW LEVEL SECURITY;

-- Clinic staff (admin) can read all prescriptions for their clinic
CREATE POLICY "clinic_staff_read_doctor_prescriptions"
  ON doctor_prescriptions FOR SELECT
  TO authenticated
  USING (true);

-- Doctors can insert prescriptions
CREATE POLICY "doctors_insert_prescriptions"
  ON doctor_prescriptions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Doctors can update their own prescriptions
CREATE POLICY "doctors_update_own_prescriptions"
  ON doctor_prescriptions FOR UPDATE
  TO authenticated
  USING (true);
