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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cases: {
        Row: {
          created_at: string
          description: string | null
          id: string
          law_section: string | null
          merit_score: number | null
          municipality: string | null
          province: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
          user_number: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          law_section?: string | null
          merit_score?: number | null
          municipality?: string | null
          province: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
          user_number?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          law_section?: string | null
          merit_score?: number | null
          municipality?: string | null
          province?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          user_number?: number | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          case_id: string
          created_at: string | null
          form_key: string
          id: string
          mime: string
          path: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          case_id: string
          created_at?: string | null
          form_key: string
          id?: string
          mime?: string
          path: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string | null
          form_key?: string
          id?: string
          mime?: string
          path?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlements: {
        Row: {
          granted_at: string
          product_id: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          product_id: string
          user_id: string
        }
        Update: {
          granted_at?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
      evidence: {
        Row: {
          case_id: string
          content_tsvector: unknown | null
          description: string | null
          file_name: string
          file_path: string
          file_type: string
          id: string
          ocr_text: string | null
          order_index: number | null
          page_count: number | null
          redacted_regions: Json | null
          tags: string[] | null
          upload_date: string
        }
        Insert: {
          case_id: string
          content_tsvector?: unknown | null
          description?: string | null
          file_name: string
          file_path: string
          file_type: string
          id?: string
          ocr_text?: string | null
          order_index?: number | null
          page_count?: number | null
          redacted_regions?: Json | null
          tags?: string[] | null
          upload_date?: string
        }
        Update: {
          case_id?: string
          content_tsvector?: unknown | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          ocr_text?: string | null
          order_index?: number | null
          page_count?: number | null
          redacted_regions?: Json | null
          tags?: string[] | null
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      form_prefill_data: {
        Row: {
          case_id: string
          created_at: string
          extracted_data: Json
          id: string
          pathway_type: string
          province: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          extracted_data?: Json
          id?: string
          pathway_type: string
          province: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          extracted_data?: Json
          id?: string
          pathway_type?: string
          province?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_prefill_data_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      form_usage: {
        Row: {
          case_id: string | null
          completion_status: string | null
          completion_time_minutes: number | null
          created_at: string
          feedback: string | null
          field_data: Json | null
          form_id: string
          id: string
          success_rating: number | null
          user_id: string | null
        }
        Insert: {
          case_id?: string | null
          completion_status?: string | null
          completion_time_minutes?: number | null
          created_at?: string
          feedback?: string | null
          field_data?: Json | null
          form_id: string
          id?: string
          success_rating?: number | null
          user_id?: string | null
        }
        Update: {
          case_id?: string | null
          completion_status?: string | null
          completion_time_minutes?: number | null
          created_at?: string
          feedback?: string | null
          field_data?: Json | null
          form_id?: string
          id?: string
          success_rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_usage_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_usage_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          category: string
          created_at: string
          description: string | null
          filing_requirements: Json | null
          form_code: string
          form_fields: Json | null
          id: string
          instructions: string | null
          is_active: boolean
          price_cents: number
          title: string
          tribunal_type: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          filing_requirements?: Json | null
          form_code: string
          form_fields?: Json | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          price_cents?: number
          title: string
          tribunal_type: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          filing_requirements?: Json | null
          form_code?: string
          form_fields?: Json | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          price_cents?: number
          title?: string
          tribunal_type?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      legal_pathways: {
        Row: {
          case_id: string
          confidence_score: number
          created_at: string
          id: string
          next_steps: Json | null
          pathway_type: string
          recommendation: string
          relevant_laws: Json | null
        }
        Insert: {
          case_id: string
          confidence_score?: number
          created_at?: string
          id?: string
          next_steps?: Json | null
          pathway_type: string
          recommendation: string
          relevant_laws?: Json | null
        }
        Update: {
          case_id?: string
          confidence_score?: number
          created_at?: string
          id?: string
          next_steps?: Json | null
          pathway_type?: string
          recommendation?: string
          relevant_laws?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_pathways_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      low_income_applications: {
        Row: {
          annual_income: number
          created_at: string
          email: string
          employment_status: string
          full_name: string
          household_size: number
          id: string
          phone: string | null
          proof_of_income_url: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_income: number
          created_at?: string
          email: string
          employment_status: string
          full_name: string
          household_size: number
          id?: string
          phone?: string | null
          proof_of_income_url: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_income?: number
          created_at?: string
          email?: string
          employment_status?: string
          full_name?: string
          household_size?: number
          id?: string
          phone?: string | null
          proof_of_income_url?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_audit: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          payment_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          payment_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          payment_id?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          captured_at: string | null
          case_id: string | null
          created_at: string
          currency: string
          id: string
          payer_id: string | null
          payment_id: string
          payment_provider: string
          paypal_response: Json | null
          plan_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          captured_at?: string | null
          case_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          payer_id?: string | null
          payment_id: string
          payment_provider?: string
          paypal_response?: Json | null
          plan_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          captured_at?: string | null
          case_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          payer_id?: string | null
          payment_id?: string
          payment_provider?: string
          paypal_response?: Json | null
          plan_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          admin_response: string | null
          case_id: string | null
          created_at: string
          email: string
          feedback_type: string
          id: string
          is_public: boolean | null
          is_resolved: boolean | null
          message: string
          name: string
          rating: number | null
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_response?: string | null
          case_id?: string | null
          created_at?: string
          email: string
          feedback_type: string
          id?: string
          is_public?: boolean | null
          is_resolved?: boolean | null
          message: string
          name: string
          rating?: number | null
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_response?: string | null
          case_id?: string | null
          created_at?: string
          email?: string
          feedback_type?: string
          id?: string
          is_public?: boolean | null
          is_resolved?: boolean | null
          message?: string
          name?: string
          rating?: number | null
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_free_tier_eligibility: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_form_usage: {
        Args: { form_id: string }
        Returns: undefined
      }
      make_user_admin: {
        Args: { _email: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
