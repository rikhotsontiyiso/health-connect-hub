-- Allow guest bookings by making patient_id nullable in appointments and invoices
ALTER TABLE public.appointments ALTER COLUMN patient_id DROP NOT NULL;
ALTER TABLE public.invoices ALTER COLUMN patient_id DROP NOT NULL;

-- Update RLS policies to allow anonymous inserts for appointments and invoices
-- Note: SELECT/UPDATE/DELETE still require authentication for security

-- Allow anonymous inserts to appointments
CREATE POLICY "Anyone can create appointments" ON public.appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous inserts to invoices
CREATE POLICY "Anyone can create invoices" ON public.invoices
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Update existing policies to handle null patient_id safely
DROP POLICY IF EXISTS "Patients view own appointments" ON public.appointments;
CREATE POLICY "Patients view own appointments" ON public.appointments
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id OR public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Patients view own invoices" ON public.invoices;
CREATE POLICY "Patients view own invoices" ON public.invoices
  FOR SELECT TO authenticated
  USING (auth.uid() = patient_id OR public.is_staff(auth.uid()));
