
-- ============================================================
-- Booking reference on appointments
-- ============================================================
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE;

CREATE SEQUENCE IF NOT EXISTS public.appointment_reference_seq;

CREATE OR REPLACE FUNCTION public.set_appointment_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.reference IS NULL THEN
    NEW.reference := 'HC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.appointment_reference_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_appointment_reference_trigger ON public.appointments;
CREATE TRIGGER set_appointment_reference_trigger
  BEFORE INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_appointment_reference();

-- Backfill existing rows
UPDATE public.appointments
SET reference = 'HC-' || to_char(created_at, 'YYYY') || '-' || lpad(nextval('public.appointment_reference_seq')::text, 5, '0')
WHERE reference IS NULL;

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  medical_aid_name TEXT,
  medical_aid_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  allergies TEXT,
  chronic_conditions TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_staff(auth.uid()));

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto create profile on new user (extend handle_new_user)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing users
INSERT INTO public.profiles (user_id, email)
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.id IS NULL;

-- ============================================================
-- invoices
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('unpaid', 'paid', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own invoices" ON public.invoices
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id OR public.is_staff(auth.uid()));

CREATE POLICY "Patients create own invoices" ON public.invoices
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = patient_id OR public.is_staff(auth.uid()));

CREATE POLICY "Staff update invoices" ON public.invoices
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- prescriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id UUID NOT NULL,
  doctor_user_id UUID,
  medication TEXT NOT NULL,
  dosage TEXT,
  instructions TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.prescriptions TO authenticated;
GRANT ALL ON public.prescriptions TO service_role;

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own prescriptions" ON public.prescriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id OR public.is_staff(auth.uid()));

CREATE POLICY "Doctors write prescriptions" ON public.prescriptions
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors update prescriptions" ON public.prescriptions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'doctor'))
  WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors delete prescriptions" ON public.prescriptions
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'doctor'));

CREATE TRIGGER prescriptions_updated_at
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- lab_results
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id UUID NOT NULL,
  doctor_user_id UUID,
  title TEXT NOT NULL,
  result_summary TEXT,
  file_url TEXT,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_results TO authenticated;
GRANT ALL ON public.lab_results TO service_role;

ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own labs" ON public.lab_results
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id OR public.is_staff(auth.uid()));

CREATE POLICY "Doctors write labs" ON public.lab_results
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors update labs" ON public.lab_results
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'doctor'))
  WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors delete labs" ON public.lab_results
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'doctor'));

CREATE TRIGGER lab_results_updated_at
  BEFORE UPDATE ON public.lab_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- visit_notes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.visit_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL,
  doctor_user_id UUID,
  symptoms TEXT,
  diagnosis TEXT,
  treatment TEXT,
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.visit_notes TO authenticated;
GRANT ALL ON public.visit_notes TO service_role;

ALTER TABLE public.visit_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own visits" ON public.visit_notes
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id OR public.is_staff(auth.uid()));

CREATE POLICY "Doctors write visits" ON public.visit_notes
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Doctors update visits" ON public.visit_notes
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'doctor'))
  WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE TRIGGER visit_notes_updated_at
  BEFORE UPDATE ON public.visit_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- staff_notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.staff_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.staff_notifications TO authenticated;
GRANT ALL ON public.staff_notifications TO service_role;

ALTER TABLE public.staff_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view notifications" ON public.staff_notifications
  FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Anyone auth insert notifications" ON public.staff_notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Staff update notifications" ON public.staff_notifications
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
