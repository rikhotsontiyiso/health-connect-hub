import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const APPOINTMENT_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  dob: z.string().optional(),
  gender: z.string().optional(),
  service: z.string().min(1),
  doctor: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  reason: z.string().optional(),
  medicalAid: z.string().optional(),
  notes: z.string().optional(),
});

export const createAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: z.infer<typeof createSchema>) => createSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("appointments")
      .insert({
        patient_id: userId,
        patient_first_name: data.firstName,
        patient_last_name: data.lastName,
        patient_email: data.email,
        patient_phone: data.phone,
        patient_dob: data.dob || null,
        patient_gender: data.gender || null,
        service: data.service,
        doctor_id: data.doctor,
        appointment_date: data.date,
        appointment_time: data.time,
        reason: data.reason || null,
        medical_aid: data.medicalAid || null,
        notes: data.notes || null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listMyAppointments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", userId)
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listAllAppointments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: staffCheck } = await supabase.rpc("is_staff", { _user_id: userId });
    if (!staffCheck) throw new Error("Forbidden");
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const updateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(APPOINTMENT_STATUSES),
});

export const updateAppointmentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: z.infer<typeof updateStatusSchema>) => updateStatusSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: staffCheck } = await supabase.rpc("is_staff", { _user_id: userId });
    if (!staffCheck) throw new Error("Forbidden");
    const { data: row, error } = await supabase
      .from("appointments")
      .update({ status: data.status })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const cancelMyAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", data.id)
      .eq("patient_id", userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    const roles = (data ?? []).map((r) => r.role);
    return {
      roles,
      isStaff: roles.includes("receptionist") || roles.includes("doctor"),
    };
  });
