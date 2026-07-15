import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---- Prescriptions ----

export const listMyPrescriptions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("prescriptions")
      .select("*, appointments(reference, appointment_date, doctor_id)")
      .eq("patient_id", userId)
      .order("issued_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listPatientPrescriptions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { patientId: string }) => z.object({ patientId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: staff } = await supabase.rpc("is_staff", { _user_id: userId });
    if (!staff) throw new Error("Forbidden");
    const { data: rows, error } = await supabase
      .from("prescriptions")
      .select("*, appointments(reference, appointment_date, doctor_id)")
      .eq("patient_id", data.patientId)
      .order("issued_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const addPrescriptionSchema = z.object({
  appointment_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  medication: z.string().min(1).max(200),
  dosage: z.string().max(200).optional(),
  instructions: z.string().max(1000).optional(),
});

export const addPrescription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof addPrescriptionSchema>) => addPrescriptionSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("prescriptions")
      .insert({
        appointment_id: data.appointment_id,
        patient_id: data.patient_id,
        doctor_user_id: userId,
        medication: data.medication,
        dosage: data.dosage || null,
        instructions: data.instructions || null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// ---- Lab results ----

export const listMyLabResults = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("lab_results")
      .select("*")
      .eq("patient_id", userId)
      .order("performed_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listPatientLabResults = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { patientId: string }) => z.object({ patientId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: staff } = await supabase.rpc("is_staff", { _user_id: userId });
    if (!staff) throw new Error("Forbidden");
    const { data: rows, error } = await supabase
      .from("lab_results")
      .select("*")
      .eq("patient_id", data.patientId)
      .order("performed_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const addLabSchema = z.object({
  appointment_id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  result_summary: z.string().max(2000).optional(),
  file_url: z.string().url().max(500).optional(),
});

export const addLabResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof addLabSchema>) => addLabSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("lab_results")
      .insert({
        appointment_id: data.appointment_id || null,
        patient_id: data.patient_id,
        doctor_user_id: userId,
        title: data.title,
        result_summary: data.result_summary || null,
        file_url: data.file_url || null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// ---- Visit notes ----

export const listMyVisitNotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("visit_notes")
      .select("*, appointments(reference, appointment_date, appointment_time, service, doctor_id)")
      .eq("patient_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getVisitNote = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { appointmentId: string }) => z.object({ appointmentId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: row, error } = await supabase
      .from("visit_notes")
      .select("*")
      .eq("appointment_id", data.appointmentId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

const saveVisitSchema = z.object({
  appointment_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  symptoms: z.string().max(2000).optional(),
  diagnosis: z.string().max(2000).optional(),
  treatment: z.string().max(2000).optional(),
  follow_up_date: z.string().optional(),
  notes: z.string().max(2000).optional(),
  mark_completed: z.boolean().optional(),
});

export const saveVisitNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof saveVisitSchema>) => saveVisitSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("visit_notes")
      .upsert(
        {
          appointment_id: data.appointment_id,
          patient_id: data.patient_id,
          doctor_user_id: userId,
          symptoms: data.symptoms || null,
          diagnosis: data.diagnosis || null,
          treatment: data.treatment || null,
          follow_up_date: data.follow_up_date || null,
          notes: data.notes || null,
        },
        { onConflict: "appointment_id" },
      )
      .select()
      .single();
    if (error) throw new Error(error.message);

    if (data.mark_completed) {
      await supabase
        .from("appointments")
        .update({ status: "completed" })
        .eq("id", data.appointment_id);
    }
    return row;
  });

// ---- Staff notifications ----

export const listStaffNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("staff_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const markNotificationRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    await supabase.from("staff_notifications").update({ read: true }).eq("id", data.id);
    return { ok: true };
  });
