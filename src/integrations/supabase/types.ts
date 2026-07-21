export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          doctor_id: string
          id: string
          medical_aid: string | null
          notes: string | null
          patient_dob: string | null
          patient_email: string
          patient_first_name: string
          patient_gender: string | null
          patient_id: string | null
          patient_last_name: string
          patient_phone: string
          reason: string | null
          reference: string | null
          service: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          doctor_id: string
          id?: string
          medical_aid?: string | null
          notes?: string | null
          patient_dob?: string | null
          patient_email: string
          patient_first_name: string
          patient_gender?: string | null
          patient_id?: string | null
          patient_last_name: string
          patient_phone: string
          reason?: string | null
          reference?: string | null
          service: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          doctor_id?: string
          id?: string
          medical_aid?: string | null
          notes?: string | null
          patient_dob?: string | null
          patient_email?: string
          patient_first_name?: string
          patient_gender?: string | null
          patient_id?: string | null
          patient_last_name?: string
          patient_phone?: string
          reason?: string | null
          reference?: string | null
          service?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          appointment_id: string
          created_at: string
          id: string
          issued_at: string
          paid_at: string | null
          patient_id: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount?: number
          appointment_id: string
          created_at?: string
          id?: string
          issued_at?: string
          paid_at?: string | null
          patient_id?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          appointment_id?: string
          created_at?: string
          id?: string
          issued_at?: string
          paid_at?: string | null
          patient_id?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_results: {
        Row: {
          appointment_id: string | null
          created_at: string
          doctor_user_id: string | null
          file_url: string | null
          id: string
          patient_id: string
          performed_at: string
          result_summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          doctor_user_id?: string | null
          file_url?: string | null
          id?: string
          patient_id: string
          performed_at?: string
          result_summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          doctor_user_id?: string | null
          file_url?: string | null
          id?: string
          patient_id?: string
          performed_at?: string
          result_summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_results_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          appointment_id: string | null
          created_at: string
          doctor_user_id: string | null
          dosage: string | null
          id: string
          instructions: string | null
          issued_at: string
          medication: string
          patient_id: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          doctor_user_id?: string | null
          dosage?: string | null
          id?: string
          instructions?: string | null
          issued_at?: string
          medication: string
          patient_id: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          doctor_user_id?: string | null
          dosage?: string | null
          id?: string
          instructions?: string | null
          issued_at?: string
          medication?: string
          patient_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allergies: string | null
          blood_group: string | null
          chronic_conditions: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          gender: string | null
          id: string
          medical_aid_name: string | null
          medical_aid_number: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string | null
          blood_group?: string | null
          chronic_conditions?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          medical_aid_name?: string | null
          medical_aid_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string | null
          blood_group?: string | null
          chronic_conditions?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          medical_aid_name?: string | null
          medical_aid_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      staff_notifications: {
        Row: {
          appointment_id: string | null
          created_at: string
          id: string
          kind: string
          message: string
          read: boolean
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          kind: string
          message: string
          read?: boolean
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          message?: string
          read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "staff_notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visit_notes: {
        Row: {
          appointment_id: string
          created_at: string
          diagnosis: string | null
          doctor_user_id: string | null
          follow_up_date: string | null
          id: string
          notes: string | null
          patient_id: string
          symptoms: string | null
          treatment: string | null
          updated_at: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          diagnosis?: string | null
          doctor_user_id?: string | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          symptoms?: string | null
          treatment?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          diagnosis?: string | null
          doctor_user_id?: string | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          symptoms?: string | null
          treatment?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_notes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "patient" | "receptionist" | "doctor"
      appointment_status: "pending" | "confirmed" | "completed" | "cancelled"
      payment_status: "unpaid" | "paid" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["patient", "receptionist", "doctor"],
      appointment_status: ["pending", "confirmed", "completed", "cancelled"],
      payment_status: ["unpaid", "paid", "refunded"],
    },
  },
} as const
