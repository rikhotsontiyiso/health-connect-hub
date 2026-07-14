## Goal

Move appointments from a fake-ref form into a real database with a `status` field (Pending → Confirmed / Completed / Cancelled) that staff can manage and patients can view.

## What gets built

### 1. Backend (Lovable Cloud)
Enable Lovable Cloud, then create:

- **`appointments` table** with:
  - patient_id (uuid, → auth.users)
  - patient_name, patient_email, patient_phone (denormalised so guests/staff-created bookings work)
  - doctor_id, service, appointment_date, appointment_time, reason, medical_aid, notes
  - **`status`** — enum `appointment_status` = `pending | confirmed | completed | cancelled`, default `pending`
  - created_at, updated_at
- **`app_role` enum** = `patient | receptionist | doctor` + `user_roles` table + `has_role()` security-definer function (per user-roles rule).
- **RLS policies**:
  - Patients: SELECT/INSERT/UPDATE their own rows (update limited to cancelling their own pending/confirmed booking).
  - Receptionist + Doctor: SELECT all, UPDATE status on any row.
- Trigger: auto-assign `patient` role on signup; auto-update `updated_at`.

### 2. Auth
- Email/password signup + login on `/auth` (public route).
- `_authenticated` layout gate for portal pages.

### 3. Patient flow
- `/appointments` (existing booking form) → on submit, if signed in: insert row with `status='pending'`; if not signed in: prompt to sign in / sign up first (redirect back after auth). Confirmation screen shows real DB reference + Pending badge.
- `/portal/appointments` (authenticated) — patient's upcoming + history tabs, filtered by status, with a **Cancel** button for their own pending/confirmed rows.

### 4. Staff flow
- `/staff/appointments` (authenticated, receptionist or doctor only) — table of all appointments with filters by status (All / Pending / Confirmed / Completed / Cancelled) and a status dropdown per row to change it. Optimistic update via TanStack Query mutation.

### 5. UI helpers
- Reusable `StatusBadge` component (colour-coded: pending=amber, confirmed=blue, completed=green, cancelled=muted red).
- Header shows "Sign in" when logged out; "My appointments" + "Sign out" when logged in; adds "Staff" link when the user has a staff role.

## Out of scope this turn
Payments, invoices, WhatsApp, notifications, AI-driven booking actions — kept for later phases as agreed.

## Technical notes

- Server functions in `src/lib/appointments.functions.ts` using `requireSupabaseAuth`:
  - `createAppointment`, `listMyAppointments`, `cancelMyAppointment`
  - `listAllAppointments` (staff-gated via `has_role`)
  - `updateAppointmentStatus` (staff-gated)
- Migration includes GRANTs to `authenticated` + `service_role` for both tables (no `anon`).
- Staff accounts are seeded via a migration that inserts into `user_roles` for a specified email — I'll note the seed email in the reply so you can sign up with it to get staff access.

Confirm and I'll enable Cloud and build it.
