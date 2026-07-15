
-- Replace permissive INSERT with a trigger-based notification
DROP POLICY IF EXISTS "Anyone auth insert notifications" ON public.staff_notifications;

CREATE OR REPLACE FUNCTION public.notify_new_appointment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.staff_notifications (kind, message, appointment_id)
  VALUES (
    'new_appointment',
    'New booking ' || COALESCE(NEW.reference, NEW.id::text) || ' — ' || NEW.patient_first_name || ' ' || NEW.patient_last_name || ' (' || NEW.service || ') on ' || NEW.appointment_date || ' ' || NEW.appointment_time,
    NEW.id
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_new_appointment_notify ON public.appointments;
CREATE TRIGGER on_new_appointment_notify
  AFTER INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_appointment();

-- Lock down SECURITY DEFINER functions from direct call by signed-in users.
-- They are only invoked by triggers (owned by postgres), so this does not break app behavior.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_new_appointment() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_appointment_reference() FROM PUBLIC, anon, authenticated;
