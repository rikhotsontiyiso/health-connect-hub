
ALTER TABLE public.appointments ALTER COLUMN patient_id DROP NOT NULL;
ALTER TABLE public.invoices ALTER COLUMN patient_id DROP NOT NULL;

DROP POLICY IF EXISTS "Patients create own appointments" ON public.appointments;
CREATE POLICY "Anyone can create appointments"
  ON public.appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND patient_id IS NULL)
    OR (auth.uid() IS NOT NULL AND patient_id = auth.uid())
  );

DROP POLICY IF EXISTS "Patients create own invoices" ON public.invoices;
CREATE POLICY "Anyone can create invoices for their booking"
  ON public.invoices FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND patient_id IS NULL)
    OR (auth.uid() IS NOT NULL AND (patient_id = auth.uid() OR is_staff(auth.uid())))
  );

GRANT INSERT ON public.appointments TO anon;
GRANT INSERT ON public.invoices TO anon;
