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
          event_type: string
          id: string
          metadata: Json | null
          metrics: Json | null
          page_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          metrics?: Json | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          metrics?: Json | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_admins: {
        Row: {
          created_at: string
          email: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      case_deadlines: {
        Row: {
          case_id: string | null
          completed: boolean
          created_at: string
          description: string | null
          due_date: string
          id: string
          priority: string
          title: string
          user_id: string
        }
        Insert: {
          case_id?: string | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          priority?: string
          title: string
          user_id: string
        }
        Update: {
          case_id?: string | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          title?: string
          user_id?: string
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
          priority: string
          status: string
          title: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description?: string | null
          event_date: string
          event_type?: string
          id?: string
          location?: string | null
          priority?: string
          status?: string
          title: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          location?: string | null
          priority?: string
          status?: string
          title?: string
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
      case_merit: {
        Row: {
          case_id: string
          components: Json
          created_at: string
          gaps: string[] | null
          id: string
          reasons: Json
          score_total: number
          strengths: string[] | null
          updated_at: string
          weaknesses: string[] | null
        }
        Insert: {
          case_id: string
          components?: Json
          created_at?: string
          gaps?: string[] | null
          id?: string
          reasons?: Json
          score_total: number
          strengths?: string[] | null
          updated_at?: string
          weaknesses?: string[] | null
        }
        Update: {
          case_id?: string
          components?: Json
          created_at?: string
          gaps?: string[] | null
          id?: string
          reasons?: Json
          score_total?: number
          strengths?: string[] | null
          updated_at?: string
          weaknesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "case_merit_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: true
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_milestones: {
        Row: {
          case_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          milestone_type: string
          order_index: number
          title: string
        }
        Insert: {
          case_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          milestone_type?: string
          order_index?: number
          title: string
        }
        Update: {
          case_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          milestone_type?: string
          order_index?: number
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
      case_notes: {
        Row: {
          case_id: string
          content: string
          created_at: string
          id: string
          note_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id: string
          content: string
          created_at?: string
          id?: string
          note_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string
          content?: string
          created_at?: string
          id?: string
          note_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_notes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          cohort_batch: string | null
          created_at: string
          decision_result_json: Json | null
          description: string | null
          flow_step: string | null
          id: string
          is_paid: boolean | null
          law_section: string | null
          merit_error: string | null
          merit_score: number | null
          merit_status: string | null
          merit_updated_at: string | null
          municipality: string | null
          paid_at: string | null
          program_id: string | null
          program_referral_code: string | null
          province: string
          referral_source: string | null
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
          cohort_batch?: string | null
          created_at?: string
          decision_result_json?: Json | null
          description?: string | null
          flow_step?: string | null
          id?: string
          is_paid?: boolean | null
          law_section?: string | null
          merit_error?: string | null
          merit_score?: number | null
          merit_status?: string | null
          merit_updated_at?: string | null
          municipality?: string | null
          paid_at?: string | null
          program_id?: string | null
          program_referral_code?: string | null
          province: string
          referral_source?: string | null
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
          cohort_batch?: string | null
          created_at?: string
          decision_result_json?: Json | null
          description?: string | null
          flow_step?: string | null
          id?: string
          is_paid?: boolean | null
          law_section?: string | null
          merit_error?: string | null
          merit_score?: number | null
          merit_status?: string | null
          merit_updated_at?: string | null
          municipality?: string | null
          paid_at?: string | null
          program_id?: string | null
          program_referral_code?: string | null
          province?: string
          referral_source?: string | null
          status?: string | null
          timeline_viewed?: boolean | null
          title?: string
          triage?: Json | null
          triage_complete?: boolean | null
          updated_at?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          download_count: number
          file_path: string
          id: string
          is_premium: boolean
          preview_content: string | null
          tags: string[] | null
          template_type: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          download_count?: number
          file_path: string
          id?: string
          is_premium?: boolean
          preview_content?: string | null
          tags?: string[] | null
          template_type: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number
          file_path?: string
          id?: string
          is_premium?: boolean
          preview_content?: string | null
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
          form_key: string | null
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id?: string | null
          content?: string | null
          created_at?: string
          file_path?: string | null
          form_key?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string | null
          content?: string | null
          created_at?: string
          file_path?: string | null
          form_key?: string | null
          id?: string
          status?: string
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
      entitlement_audit: {
        Row: {
          acted_by: string
          acted_on: string
          action: string
          created_at: string
          ends_at: string | null
          id: number
          note: string | null
          product_id: string
        }
        Insert: {
          acted_by: string
          acted_on: string
          action: string
          created_at?: string
          ends_at?: string | null
          id?: number
          note?: string | null
          product_id: string
        }
        Update: {
          acted_by?: string
          acted_on?: string
          action?: string
          created_at?: string
          ends_at?: string | null
          id?: number
          note?: string | null
          product_id?: string
        }
        Relationships: []
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
          analysis_data: Json
          created_at: string
          evidence_id: string
          id: string
        }
        Insert: {
          analysis_data: Json
          created_at?: string
          evidence_id: string
          id?: string
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          evidence_id?: string
          id?: string
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
      evidence_links: {
        Row: {
          created_at: string
          evidence_id: string
          form_id: string
          id: string
          note: string | null
          section_key: string
        }
        Insert: {
          created_at?: string
          evidence_id: string
          form_id: string
          id?: string
          note?: string | null
          section_key: string
        }
        Update: {
          created_at?: string
          evidence_id?: string
          form_id?: string
          id?: string
          note?: string | null
          section_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_links_evidence_id_fkey"
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
          metadata_key: string
          metadata_value: Json | null
          parties: Json | null
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
          metadata_key: string
          metadata_value?: Json | null
          parties?: Json | null
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
          metadata_key?: string
          metadata_value?: Json | null
          parties?: Json | null
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
      formal_merit_scores: {
        Row: {
          band: string | null
          case_id: string
          created_at: string
          created_by: string | null
          id: string
          result: Json
          score: number | null
        }
        Insert: {
          band?: string | null
          case_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          result: Json
          score?: number | null
        }
        Update: {
          band?: string | null
          case_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          result?: Json
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "formal_merit_scores_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          category: string
          checksum: string | null
          created_at: string
          description: string | null
          filing_requirements: Json | null
          form_code: string
          form_fields: Json | null
          id: string
          instructions: string | null
          is_active: boolean
          jurisdiction: string | null
          last_verified_at: string | null
          pdf_url: string | null
          price_cents: number
          province: string | null
          purchasable: boolean
          source_url: string | null
          status: string | null
          title: string
          tribunal_type: string
          updated_at: string
          usage_count: number | null
          version_date: string | null
        }
        Insert: {
          category: string
          checksum?: string | null
          created_at?: string
          description?: string | null
          filing_requirements?: Json | null
          form_code: string
          form_fields?: Json | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          jurisdiction?: string | null
          last_verified_at?: string | null
          pdf_url?: string | null
          price_cents?: number
          province?: string | null
          purchasable?: boolean
          source_url?: string | null
          status?: string | null
          title: string
          tribunal_type: string
          updated_at?: string
          usage_count?: number | null
          version_date?: string | null
        }
        Update: {
          category?: string
          checksum?: string | null
          created_at?: string
          description?: string | null
          filing_requirements?: Json | null
          form_code?: string
          form_fields?: Json | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          jurisdiction?: string | null
          last_verified_at?: string | null
          pdf_url?: string | null
          price_cents?: number
          province?: string | null
          purchasable?: boolean
          source_url?: string | null
          status?: string | null
          title?: string
          tribunal_type?: string
          updated_at?: string
          usage_count?: number | null
          version_date?: string | null
        }
        Relationships: []
      }
      funnel_events: {
        Row: {
          case_id: string | null
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funnel_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          journey: string | null
          name: string | null
          payload: Json | null
          phone: string | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          journey?: string | null
          name?: string | null
          payload?: Json | null
          phone?: string | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          journey?: string | null
          name?: string | null
          payload?: Json | null
          phone?: string | null
          source?: string | null
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
          user_id: string
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
          user_id?: string
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
          user_id?: string
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
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
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
      pathway_rules: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          category: string
          created_at: string
          filing_fee: string | null
          id: string
          is_active: boolean | null
          issue_keywords: string[]
          pathway_id: string
          priority: number | null
          province: string | null
          reasoning: string | null
          recommended_forms: string[] | null
          rule_name: string
          success_rate: number | null
          timeframe: string | null
          tribunal: string
          updated_at: string
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          category: string
          created_at?: string
          filing_fee?: string | null
          id?: string
          is_active?: boolean | null
          issue_keywords?: string[]
          pathway_id: string
          priority?: number | null
          province?: string | null
          reasoning?: string | null
          recommended_forms?: string[] | null
          rule_name: string
          success_rate?: number | null
          timeframe?: string | null
          tribunal: string
          updated_at?: string
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          category?: string
          created_at?: string
          filing_fee?: string | null
          id?: string
          is_active?: boolean | null
          issue_keywords?: string[]
          pathway_id?: string
          priority?: number | null
          province?: string | null
          reasoning?: string | null
          recommended_forms?: string[] | null
          rule_name?: string
          success_rate?: number | null
          timeframe?: string | null
          tribunal?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          amount_cents: number | null
          case_id: string | null
          created_at: string
          currency: string
          entitlement_key: string | null
          form_id: string | null
          id: string
          paid_at: string | null
          payment_id: string | null
          payment_intent_id: string | null
          payment_provider: string | null
          plan_type: string | null
          product_id: string | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          amount_cents?: number | null
          case_id?: string | null
          created_at?: string
          currency?: string
          entitlement_key?: string | null
          form_id?: string | null
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_intent_id?: string | null
          payment_provider?: string | null
          plan_type?: string | null
          product_id?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          amount_cents?: number | null
          case_id?: string | null
          created_at?: string
          currency?: string
          entitlement_key?: string | null
          form_id?: string | null
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_intent_id?: string | null
          payment_provider?: string | null
          plan_type?: string | null
          product_id?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
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
          {
            foreignKeyName: "payments_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
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
          description: string | null
          disable_ai_beyond_procedural: boolean | null
          disable_pricing: boolean | null
          features: Json | null
          id: string
          is_active: boolean
          logo_url: string | null
          max_referrals: number | null
          name: string
          organization: string | null
          primary_color: string | null
          referral_count: number | null
          secondary_color: string | null
          settings: Json | null
          show_no_legal_advice_banner: boolean | null
          slug: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          cohort_batch?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          disable_ai_beyond_procedural?: boolean | null
          disable_pricing?: boolean | null
          features?: Json | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          max_referrals?: number | null
          name: string
          organization?: string | null
          primary_color?: string | null
          referral_count?: number | null
          secondary_color?: string | null
          settings?: Json | null
          show_no_legal_advice_banner?: boolean | null
          slug: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          cohort_batch?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          disable_ai_beyond_procedural?: boolean | null
          disable_pricing?: boolean | null
          features?: Json | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          max_referrals?: number | null
          name?: string
          organization?: string | null
          primary_color?: string | null
          referral_count?: number | null
          secondary_color?: string | null
          settings?: Json | null
          show_no_legal_advice_banner?: boolean | null
          slug?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          count: number
          key: string
          updated_at: string
        }
        Insert: {
          count?: number
          key: string
          updated_at?: string
        }
        Update: {
          count?: number
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          total_credits_earned: number | null
          user_id: string
          uses_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          total_credits_earned?: number | null
          user_id: string
          uses_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          total_credits_earned?: number | null
          user_id?: string
          uses_count?: number | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referee_id: string
          referrer_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          referee_id: string
          referrer_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          referee_id?: string
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
          created_at: string
          id: string
          message: string
          sender_name: string
          sender_type: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_name: string
          sender_type: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_name?: string
          sender_type?: string
          ticket_id?: string
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
          email: string
          id: string
          name: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sweep_runs: {
        Row: {
          created_at: string
          errors: Json | null
          finished_at: string | null
          forms_changed: number | null
          forms_checked: number | null
          forms_deprecated: number | null
          id: string
          metadata: Json | null
          started_at: string
          status: string
        }
        Insert: {
          created_at?: string
          errors?: Json | null
          finished_at?: string | null
          forms_changed?: number | null
          forms_checked?: number | null
          forms_deprecated?: number | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          errors?: Json | null
          finished_at?: string | null
          forms_changed?: number | null
          forms_checked?: number | null
          forms_deprecated?: number | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved_at: string | null
          avatar_url: string | null
          case_type: string | null
          content: string
          created_at: string
          date_added: string | null
          featured: boolean | null
          id: string
          is_approved: boolean
          is_featured: boolean
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
          approved_at?: string | null
          avatar_url?: string | null
          case_type?: string | null
          content: string
          created_at?: string
          date_added?: string | null
          featured?: boolean | null
          id?: string
          is_approved?: boolean
          is_featured?: boolean
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
          approved_at?: string | null
          avatar_url?: string | null
          case_type?: string | null
          content?: string
          created_at?: string
          date_added?: string | null
          featured?: boolean | null
          id?: string
          is_approved?: boolean
          is_featured?: boolean
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
          case_id: string
          category: string | null
          created_at: string
          description: string | null
          event_date: string
          event_time: string | null
          event_type: string
          id: string
          importance: string | null
          is_auto: boolean | null
          metadata: Json | null
          notes: string | null
          source: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          case_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          event_type: string
          id?: string
          importance?: string | null
          is_auto?: boolean | null
          metadata?: Json | null
          notes?: string | null
          source?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          case_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          event_type?: string
          id?: string
          importance?: string | null
          is_auto?: boolean | null
          metadata?: Json | null
          notes?: string | null
          source?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      tutorial_videos: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          is_premium: boolean
          order_index: number
          thumbnail_url: string | null
          title: string
          video_url: string
          view_count: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_premium?: boolean
          order_index?: number
          thumbnail_url?: string | null
          title: string
          video_url: string
          view_count?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_premium?: boolean
          order_index?: number
          thumbnail_url?: string | null
          title?: string
          video_url?: string
          view_count?: number
        }
        Relationships: []
      }
      user_access: {
        Row: {
          access_expires_at: string | null
          access_unlocked: boolean
          created_at: string
          purchased_form_ids: string[] | null
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_expires_at?: string | null
          access_unlocked?: boolean
          created_at?: string
          purchased_form_ids?: string[] | null
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_expires_at?: string | null
          access_unlocked?: boolean
          created_at?: string
          purchased_form_ids?: string[] | null
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          case_id: string | null
          created_at: string
          email: string
          feedback_type: string
          id: string
          is_public: boolean
          message: string
          name: string
          rating: number | null
          subject: string
          user_id: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          email: string
          feedback_type: string
          id?: string
          is_public?: boolean
          message: string
          name: string
          rating?: number | null
          subject: string
          user_id?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string
          email?: string
          feedback_type?: string
          id?: string
          is_public?: boolean
          message?: string
          name?: string
          rating?: number | null
          subject?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
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
      webhook_events: {
        Row: {
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          processing_error: string | null
          received_at: string
          stripe_event_id: string
        }
        Insert: {
          event_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
          stripe_event_id: string
        }
        Update: {
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
          stripe_event_id?: string
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
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      export_program_summary: { Args: { program_id: string }; Returns: Json }
      get_all_admins: {
        Args: never
        Returns: {
          created_at: string
          role: string
          user_id: string
        }[]
      }
      get_all_users_admin: {
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
          last_sign_in_at: string
        }[]
      }
      get_program_stats: { Args: { program_slug: string }; Returns: Json }
      grant_admin_role: { Args: { target_user_id: string }; Returns: undefined }
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
      is_admin: { Args: never; Returns: boolean }
      make_user_admin: { Args: { _email: string }; Returns: undefined }
      revoke_admin_role: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      validate_file_ownership: { Args: { file_path: string }; Returns: boolean }
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
