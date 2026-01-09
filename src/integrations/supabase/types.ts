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
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          metrics: Json | null
          page_url: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          metrics?: Json | null
          page_url?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          metrics?: Json | null
          page_url?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      case_deadlines: {
        Row: {
          case_id: string
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          case_id: string
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          case_id?: string
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_deadlines_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_events: {
        Row: {
          case_id: string
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          location: string | null
          priority: string | null
          reminder_sent: boolean | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description?: string | null
          event_date: string
          event_type?: string
          id?: string
          location?: string | null
          priority?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          location?: string | null
          priority?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_milestones: {
        Row: {
          case_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          milestone_type: string
          order_index: number | null
          title: string
        }
        Insert: {
          case_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          milestone_type: string
          order_index?: number | null
          title: string
        }
        Update: {
          case_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          milestone_type?: string
          order_index?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_milestones_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          created_at: string
          description: string | null
          flow_step: string | null
          id: string
          is_paid: boolean | null
          law_section: string | null
          merit_score: number | null
          municipality: string | null
          province: string
          status: string | null
          timeline_viewed: boolean | null
          title: string
          triage: Json | null
          triage_complete: boolean | null
          updated_at: string
          user_id: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          flow_step?: string | null
          id?: string
          is_paid?: boolean | null
          law_section?: string | null
          merit_score?: number | null
          municipality?: string | null
          province: string
          status?: string | null
          timeline_viewed?: boolean | null
          title: string
          triage?: Json | null
          triage_complete?: boolean | null
          updated_at?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          flow_step?: string | null
          id?: string
          is_paid?: boolean | null
          law_section?: string | null
          merit_score?: number | null
          municipality?: string | null
          province?: string
          status?: string | null
          timeline_viewed?: boolean | null
          title?: string
          triage?: Json | null
          triage_complete?: boolean | null
          updated_at?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          download_count: number | null
          file_path: string | null
          id: string
          is_premium: boolean | null
          preview_content: string | null
          province: string | null
          tags: string[] | null
          template_type: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_path?: string | null
          id?: string
          is_premium?: boolean | null
          preview_content?: string | null
          province?: string | null
          tags?: string[] | null
          template_type: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_path?: string | null
          id?: string
          is_premium?: boolean | null
          preview_content?: string | null
          province?: string | null
          tags?: string[] | null
          template_type?: string
          title?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          case_id: string | null
          content: string | null
          created_at: string
          file_path: string | null
          file_type: string | null
          form_key: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id?: string | null
          content?: string | null
          created_at?: string
          file_path?: string | null
          file_type?: string | null
          form_key?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string | null
          content?: string | null
          created_at?: string
          file_path?: string | null
          file_type?: string | null
          form_key?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
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
          access_level: string
          case_id: string | null
          ends_at: string | null
          product_id: string
          source: string
          starts_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_level?: string
          case_id?: string | null
          ends_at?: string | null
          product_id: string
          source?: string
          starts_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_level?: string
          case_id?: string | null
          ends_at?: string | null
          product_id?: string
          source?: string
          starts_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          case_id: string
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
      evidence_analysis: {
        Row: {
          analysis_data: Json | null
          created_at: string
          evidence_id: string
          id: string
          relevance_score: number | null
          summary: string | null
        }
        Insert: {
          analysis_data?: Json | null
          created_at?: string
          evidence_id: string
          id?: string
          relevance_score?: number | null
          summary?: string | null
        }
        Update: {
          analysis_data?: Json | null
          created_at?: string
          evidence_id?: string
          id?: string
          relevance_score?: number | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_analysis_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_metadata: {
        Row: {
          category: string | null
          confidence_score: number | null
          created_at: string
          dates: Json | null
          doc_type: string | null
          evidence_id: string
          extracted_text: string | null
          flags: Json | null
          id: string
          key: string
          parties: Json | null
          value: string | null
        }
        Insert: {
          category?: string | null
          confidence_score?: number | null
          created_at?: string
          dates?: Json | null
          doc_type?: string | null
          evidence_id: string
          extracted_text?: string | null
          flags?: Json | null
          id?: string
          key: string
          parties?: Json | null
          value?: string | null
        }
        Update: {
          category?: string | null
          confidence_score?: number | null
          created_at?: string
          dates?: Json | null
          doc_type?: string | null
          evidence_id?: string
          extracted_text?: string | null
          flags?: Json | null
          id?: string
          key?: string
          parties?: Json | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_metadata_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          created_at: string
          description: string | null
          key: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          key: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          key?: string
          name?: string
        }
        Relationships: []
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
          pdf_url: string | null
          price_cents: number
          purchasable: boolean | null
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
          pdf_url?: string | null
          price_cents?: number
          purchasable?: boolean | null
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
          pdf_url?: string | null
          price_cents?: number
          purchasable?: boolean | null
          title?: string
          tribunal_type?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          notes: string | null
          phone: string | null
          source: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
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
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          link: string | null
          message: string | null
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_total: number | null
          created_at: string
          currency: string | null
          id: number
          paid_at: string | null
          price_id: string | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_total?: number | null
          created_at?: string
          currency?: string | null
          id?: number
          paid_at?: string | null
          price_id?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_total?: number | null
          created_at?: string
          currency?: string | null
          id?: number
          paid_at?: string | null
          price_id?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          captured_at: string | null
          created_at: string
          currency: string | null
          form_id: string | null
          id: string
          payment_id: string | null
          plan_type: string | null
          status: string | null
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          captured_at?: string | null
          created_at?: string
          currency?: string | null
          form_id?: string | null
          id?: string
          payment_id?: string | null
          plan_type?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          captured_at?: string | null
          created_at?: string
          currency?: string | null
          form_id?: string | null
          id?: string
          payment_id?: string | null
          plan_type?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_features: {
        Row: {
          feature_key: string
          product_id: string
          value: Json
        }
        Insert: {
          feature_key: string
          product_id: string
          value?: Json
        }
        Update: {
          feature_key?: string
          product_id?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "plan_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          id: string
          interval: string | null
          metadata: Json
          product_id: string
          stripe_price_id: string
          unit_amount: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          id: string
          interval?: string | null
          metadata?: Json
          product_id: string
          stripe_price_id: string
          unit_amount: number
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          id?: string
          interval?: string | null
          metadata?: Json
          product_id?: string
          stripe_price_id?: string
          unit_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          created_at: string
          id: string
          metadata: Json
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id: string
          metadata?: Json
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
        }
        Relationships: []
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
          onboarding_completed: boolean | null
          phone: string | null
          selected_province: string | null
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
          onboarding_completed?: boolean | null
          phone?: string | null
          selected_province?: string | null
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
          onboarding_completed?: boolean | null
          phone?: string | null
          selected_province?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          cohort_batch: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          custom_fields: Json | null
          description: string | null
          disable_ai_beyond_procedural: boolean | null
          disable_pricing: boolean | null
          disclaimer_text: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          max_referrals: number | null
          max_users: number | null
          name: string
          organization: string | null
          primary_color: string | null
          referral_count: number | null
          secondary_color: string | null
          settings: Json | null
          show_no_legal_advice_banner: boolean | null
          slug: string
          updated_at: string | null
          welcome_message: string | null
        }
        Insert: {
          cohort_batch?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          custom_fields?: Json | null
          description?: string | null
          disable_ai_beyond_procedural?: boolean | null
          disable_pricing?: boolean | null
          disclaimer_text?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_referrals?: number | null
          max_users?: number | null
          name: string
          organization?: string | null
          primary_color?: string | null
          referral_count?: number | null
          secondary_color?: string | null
          settings?: Json | null
          show_no_legal_advice_banner?: boolean | null
          slug: string
          updated_at?: string | null
          welcome_message?: string | null
        }
        Update: {
          cohort_batch?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          custom_fields?: Json | null
          description?: string | null
          disable_ai_beyond_procedural?: boolean | null
          disable_pricing?: boolean | null
          disclaimer_text?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_referrals?: number | null
          max_users?: number | null
          name?: string
          organization?: string | null
          primary_color?: string | null
          referral_count?: number | null
          secondary_color?: string | null
          settings?: Json | null
          show_no_legal_advice_banner?: boolean | null
          slug?: string
          updated_at?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          discount_percent: number | null
          id: string
          max_uses: number | null
          total_credits_earned: number | null
          user_id: string
          uses: number | null
          uses_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_percent?: number | null
          id?: string
          max_uses?: number | null
          total_credits_earned?: number | null
          user_id: string
          uses?: number | null
          uses_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_percent?: number | null
          id?: string
          max_uses?: number | null
          total_credits_earned?: number | null
          user_id?: string
          uses?: number | null
          uses_count?: number | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          credit_amount: number | null
          id: string
          referral_code_id: string | null
          referred_id: string | null
          referrer_id: string
          reward_amount: number | null
          status: string | null
        }
        Insert: {
          created_at?: string
          credit_amount?: number | null
          id?: string
          referral_code_id?: string | null
          referred_id?: string | null
          referrer_id: string
          reward_amount?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string
          credit_amount?: number | null
          id?: string
          referral_code_id?: string | null
          referred_id?: string | null
          referrer_id?: string
          reward_amount?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_documents: {
        Row: {
          case_id: string | null
          content: string | null
          created_at: string
          document_type: string | null
          file_path: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id?: string | null
          content?: string | null
          created_at?: string
          document_type?: string | null
          file_path?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string | null
          content?: string | null
          created_at?: string
          document_type?: string | null
          file_path?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string
          stripe_customer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          stripe_customer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          stripe_customer_id?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_webhook_events: {
        Row: {
          id: number
          livemode: boolean
          payload: Json
          processed_at: string | null
          processing_error: string | null
          received_at: string
          stripe_event_id: string
          type: string
        }
        Insert: {
          id?: number
          livemode: boolean
          payload: Json
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
          stripe_event_id: string
          type: string
        }
        Update: {
          id?: number
          livemode?: boolean
          payload?: Json
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
          stripe_event_id?: string
          type?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          message: string
          sender_name: string | null
          sender_type: string
          ticket_id: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          message: string
          sender_name?: string | null
          sender_type?: string
          ticket_id: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          message?: string
          sender_name?: string | null
          sender_type?: string
          ticket_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          id: string
          name: string | null
          priority: string | null
          status: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name?: string | null
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          name?: string | null
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          case_type: string | null
          content: string
          created_at: string
          featured: boolean | null
          id: string
          is_approved: boolean | null
          location: string | null
          name: string
          outcome: string | null
          rating: number | null
          role: string | null
          status: string | null
          story: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          case_type?: string | null
          content: string
          created_at?: string
          featured?: boolean | null
          id?: string
          is_approved?: boolean | null
          location?: string | null
          name: string
          outcome?: string | null
          rating?: number | null
          role?: string | null
          status?: string | null
          story?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          case_type?: string | null
          content?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          is_approved?: boolean | null
          location?: string | null
          name?: string
          outcome?: string | null
          rating?: number | null
          role?: string | null
          status?: string | null
          story?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          event_date: string
          event_time: string | null
          id: string
          importance: string | null
          notes: string | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date: string
          event_time?: string | null
          id?: string
          importance?: string | null
          notes?: string | null
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          id?: string
          importance?: string | null
          notes?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      tutorial_videos: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          is_premium: boolean | null
          order_index: number | null
          pathway_type: string | null
          step_number: number | null
          thumbnail_url: string | null
          title: string
          video_url: string
          view_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_premium?: boolean | null
          order_index?: number | null
          pathway_type?: string | null
          step_number?: number | null
          thumbnail_url?: string | null
          title: string
          video_url: string
          view_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_premium?: boolean | null
          order_index?: number | null
          pathway_type?: string | null
          step_number?: number | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string
          view_count?: number | null
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          created_at: string
          feedback_type: string | null
          id: string
          message: string | null
          page_url: string | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feedback_type?: string | null
          id?: string
          message?: string | null
          page_url?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feedback_type?: string | null
          id?: string
          message?: string | null
          page_url?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          deadline_reminders: boolean | null
          email_notifications: boolean | null
          id: string
          language: string | null
          marketing_emails: boolean | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline_reminders?: boolean | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline_reminders?: boolean | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string
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
      active_entitlements: {
        Row: {
          access_level: string | null
          ends_at: string | null
          is_active: boolean | null
          product_id: string | null
          source: string | null
          starts_at: string | null
          user_id: string | null
        }
        Insert: {
          access_level?: string | null
          ends_at?: string | null
          is_active?: never
          product_id?: string | null
          source?: string | null
          starts_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_level?: string | null
          ends_at?: string | null
          is_active?: never
          product_id?: string | null
          source?: string | null
          starts_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      my_active_entitlements: {
        Row: {
          access_level: string | null
          ends_at: string | null
          product_id: string | null
          source: string | null
          starts_at: string | null
        }
        Insert: {
          access_level?: string | null
          ends_at?: string | null
          product_id?: string | null
          source?: string | null
          starts_at?: string | null
        }
        Update: {
          access_level?: string | null
          ends_at?: string | null
          product_id?: string | null
          source?: string | null
          starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_free_tier_eligibility: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      export_program_summary: { Args: { p_program_id: string }; Returns: Json }
      get_all_admins: { Args: never; Returns: Json }
      get_all_users_admin: { Args: never; Returns: Json }
      get_program_stats: { Args: { p_program_id: string }; Returns: Json }
      grant_admin_role: { Args: { p_user_id: string }; Returns: undefined }
      has_active_entitlement: {
        Args: { p_product_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_form_usage: { Args: { form_id: string }; Returns: undefined }
      increment_program_referral: {
        Args: { p_program_slug: string }
        Returns: undefined
      }
      make_user_admin: { Args: { _email: string }; Returns: undefined }
      revoke_admin_role: { Args: { p_user_id: string }; Returns: undefined }
      user_feature_number: {
        Args: { p_feature_key: string; p_path: string[] }
        Returns: number
      }
      user_feature_unlimited: {
        Args: { p_feature_key: string }
        Returns: boolean
      }
      user_feature_value: { Args: { p_feature_key: string }; Returns: Json }
      user_has_feature: { Args: { p_feature_key: string }; Returns: boolean }
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
