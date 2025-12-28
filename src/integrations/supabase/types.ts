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
      admins: {
        Row: {
          email: string
          granted_at: string
          granted_by: string | null
          notes: string | null
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          email: string
          granted_at?: string
          granted_by?: string | null
          notes?: string | null
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          email?: string
          granted_at?: string
          granted_by?: string | null
          notes?: string | null
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admins_access_audit: {
        Row: {
          accessed_at: string
          accessed_by: string | null
          action: string
          details: Json | null
          id: string
          ip: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string
          accessed_by?: string | null
          action: string
          details?: Json | null
          id?: string
          ip?: string | null
          success: boolean
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string
          accessed_by?: string | null
          action?: string
          details?: Json | null
          id?: string
          ip?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
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
          metrics?: Json | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          count: number
          created_at: string
          day: string
          id: number
          ip_addr: unknown
          ip_address: string
          last_called_at: string
          route: string
          user_id: string | null
        }
        Insert: {
          count?: number
          created_at?: string
          day?: string
          id?: number
          ip_addr?: unknown
          ip_address: string
          last_called_at?: string
          route: string
          user_id?: string | null
        }
        Update: {
          count?: number
          created_at?: string
          day?: string
          id?: number
          ip_addr?: unknown
          ip_address?: string
          last_called_at?: string
          route?: string
          user_id?: string | null
        }
        Relationships: []
      }
      canlii_case_updates: {
        Row: {
          case_id: string
          citation: string | null
          court: string | null
          decision_date: string | null
          fetched_at: string | null
          id: string
          jurisdiction: string | null
          keywords: string[] | null
          summary: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          case_id: string
          citation?: string | null
          court?: string | null
          decision_date?: string | null
          fetched_at?: string | null
          id?: string
          jurisdiction?: string | null
          keywords?: string[] | null
          summary?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          case_id?: string
          citation?: string | null
          court?: string | null
          decision_date?: string | null
          fetched_at?: string | null
          id?: string
          jurisdiction?: string | null
          keywords?: string[] | null
          summary?: string | null
          title?: string | null
          url?: string | null
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
          reminder_sent: boolean
          title: string
          updated_at: string
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
          reminder_sent?: boolean
          title: string
          updated_at?: string
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
          reminder_sent?: boolean
          title?: string
          updated_at?: string
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
          reminder_sent: boolean | null
          status: string
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
          priority?: string
          reminder_sent?: boolean | null
          status?: string
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
          priority?: string
          reminder_sent?: boolean | null
          status?: string
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
      case_merit_audit: {
        Row: {
          canlii_latency_ms: number | null
          case_id: string
          created_at: string
          decision: Json
          error: string | null
          id: number
          jurisdiction: string
          query_signature: string
          run_id: string
          user_id: string
          weights: Json | null
        }
        Insert: {
          canlii_latency_ms?: number | null
          case_id: string
          created_at?: string
          decision: Json
          error?: string | null
          id?: number
          jurisdiction?: string
          query_signature: string
          run_id?: string
          user_id: string
          weights?: Json | null
        }
        Update: {
          canlii_latency_ms?: number | null
          case_id?: string
          created_at?: string
          decision?: Json
          error?: string | null
          id?: number
          jurisdiction?: string
          query_signature?: string
          run_id?: string
          user_id?: string
          weights?: Json | null
        }
        Relationships: []
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
          milestone_type: string
          order_index: number
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
        Relationships: []
      }
      case_references: {
        Row: {
          canlii_id: string | null
          case_id: string
          citations: Json | null
          court: string | null
          created_at: string
          decision_date: string | null
          id: number
          jurisdiction: string
          query_signature: string
          raw: Json | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          canlii_id?: string | null
          case_id: string
          citations?: Json | null
          court?: string | null
          created_at?: string
          decision_date?: string | null
          id?: number
          jurisdiction?: string
          query_signature: string
          raw?: Json | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          canlii_id?: string | null
          case_id?: string
          citations?: Json | null
          court?: string | null
          created_at?: string
          decision_date?: string | null
          id?: number
          jurisdiction?: string
          query_signature?: string
          raw?: Json | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cases: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_paid: boolean | null
          law_section: string | null
          merit_score: number | null
          municipality: string | null
          owner: string | null
          plan: string | null
          province: string
          status: string | null
          title: string
          triage: Json | null
          updated_at: string
          user_id: string
          user_number: number | null
          venue: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_paid?: boolean | null
          law_section?: string | null
          merit_score?: number | null
          municipality?: string | null
          owner?: string | null
          plan?: string | null
          province: string
          status?: string | null
          title: string
          triage?: Json | null
          updated_at?: string
          user_id: string
          user_number?: number | null
          venue?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_paid?: boolean | null
          law_section?: string | null
          merit_score?: number | null
          municipality?: string | null
          owner?: string | null
          plan?: string | null
          province?: string
          status?: string | null
          title?: string
          triage?: Json | null
          updated_at?: string
          user_id?: string
          user_number?: number | null
          venue?: string | null
        }
        Relationships: []
      }
      court_form_fields: {
        Row: {
          created_at: string
          field_key: string
          font_size: number
          form_id: string
          id: string
          page: number
          x: number
          y: number
        }
        Insert: {
          created_at?: string
          field_key: string
          font_size?: number
          form_id: string
          id?: string
          page?: number
          x: number
          y: number
        }
        Update: {
          created_at?: string
          field_key?: string
          font_size?: number
          form_id?: string
          id?: string
          page?: number
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "court_form_fields_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "court_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      court_forms: {
        Row: {
          code: string
          created_at: string
          doc_url: string | null
          id: string
          is_active: boolean
          jurisdiction: string
          last_checked_at: string | null
          pdf_url: string | null
          source_url: string
          title: string
        }
        Insert: {
          code: string
          created_at?: string
          doc_url?: string | null
          id?: string
          is_active?: boolean
          jurisdiction: string
          last_checked_at?: string | null
          pdf_url?: string | null
          source_url: string
          title: string
        }
        Update: {
          code?: string
          created_at?: string
          doc_url?: string | null
          id?: string
          is_active?: boolean
          jurisdiction?: string
          last_checked_at?: string | null
          pdf_url?: string | null
          source_url?: string
          title?: string
        }
        Relationships: []
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
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
      email_queue: {
        Row: {
          created_at: string | null
          email: string
          error: string | null
          id: string
          sent_at: string | null
          status: string | null
          template: string
          vars: Json | null
        }
        Insert: {
          created_at?: string | null
          email: string
          error?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          template: string
          vars?: Json | null
        }
        Update: {
          created_at?: string | null
          email?: string
          error?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          template?: string
          vars?: Json | null
        }
        Relationships: []
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
          content_tsvector: unknown
          description: string | null
          file_name: string
          file_path: string
          file_type: string
          id: string
          ocr_text: string | null
          order_index: number | null
          page_count: number | null
          redacted_regions: Json | null
          search_vector: unknown
          tags: string[] | null
          upload_date: string
        }
        Insert: {
          case_id: string
          content_tsvector?: unknown
          description?: string | null
          file_name: string
          file_path: string
          file_type: string
          id?: string
          ocr_text?: string | null
          order_index?: number | null
          page_count?: number | null
          redacted_regions?: Json | null
          search_vector?: unknown
          tags?: string[] | null
          upload_date?: string
        }
        Update: {
          case_id?: string
          content_tsvector?: unknown
          description?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          ocr_text?: string | null
          order_index?: number | null
          page_count?: number | null
          redacted_regions?: Json | null
          search_vector?: unknown
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
          case_id: string
          created_at: string
          evidence_count: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_data: Json
          case_id: string
          created_at?: string
          evidence_count?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json
          case_id?: string
          created_at?: string
          evidence_count?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_analysis_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_extractions: {
        Row: {
          case_id: string
          created_at: string
          entities: Json | null
          facts: Json | null
          id: number
          keywords: string[] | null
          query_signature: string
          score: number | null
          user_id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          entities?: Json | null
          facts?: Json | null
          id?: number
          keywords?: string[] | null
          query_signature: string
          score?: number | null
          user_id: string
        }
        Update: {
          case_id?: string
          created_at?: string
          entities?: Json | null
          facts?: Json | null
          id?: number
          keywords?: string[] | null
          query_signature?: string
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      evidence_links: {
        Row: {
          confidence: number | null
          created_at: string | null
          evidence_id: string | null
          form_id: string | null
          id: string
          note: string | null
          section_key: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          evidence_id?: string | null
          form_id?: string | null
          id?: string
          note?: string | null
          section_key?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          evidence_id?: string | null
          form_id?: string | null
          id?: string
          note?: string | null
          section_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_links_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_links_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_metadata: {
        Row: {
          category: string | null
          confidence_score: number | null
          created_at: string | null
          dates: Json | null
          doc_type: string | null
          evidence_id: string
          extracted_text: string | null
          flags: Json | null
          parties: Json | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          confidence_score?: number | null
          created_at?: string | null
          dates?: Json | null
          doc_type?: string | null
          evidence_id: string
          extracted_text?: string | null
          flags?: Json | null
          parties?: Json | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          confidence_score?: number | null
          created_at?: string | null
          dates?: Json | null
          doc_type?: string | null
          evidence_id?: string
          extracted_text?: string | null
          flags?: Json | null
          parties?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_metadata_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: true
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
        ]
      }
      exhibits: {
        Row: {
          case_id: string | null
          created_at: string | null
          evidence_id: string | null
          id: string
          label: string
          order_index: number | null
          page_end: number | null
          page_start: number | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          evidence_id?: string | null
          id?: string
          label: string
          order_index?: number | null
          page_end?: number | null
          page_start?: number | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          evidence_id?: string | null
          id?: string
          label?: string
          order_index?: number | null
          page_end?: number | null
          page_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exhibits_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exhibits_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
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
      form_submissions: {
        Row: {
          created_at: string
          form_id: string
          id: string
          payload: Json
          status: string
          submitted_by: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: string
          payload: Json
          status?: string
          submitted_by: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          payload?: Json
          status?: string
          submitted_by?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
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
          internal_route: string | null
          is_active: boolean
          legal_section: string | null
          meta: Json | null
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
          internal_route?: string | null
          is_active?: boolean
          legal_section?: string | null
          meta?: Json | null
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
          internal_route?: string | null
          is_active?: boolean
          legal_section?: string | null
          meta?: Json | null
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
      forms_catalog: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          jurisdiction: string
          last_checked_at: string | null
          last_status: number | null
          official_url: string
          title: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          jurisdiction: string
          last_checked_at?: string | null
          last_status?: number | null
          official_url: string
          title: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          jurisdiction?: string
          last_checked_at?: string | null
          last_status?: number | null
          official_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
          journey: string | null
          name: string | null
          payload: Json | null
          phone: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          journey?: string | null
          name?: string | null
          payload?: Json | null
          phone?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          journey?: string | null
          name?: string | null
          payload?: Json | null
          phone?: string | null
          source?: string | null
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          citation: string | null
          content_hash: string | null
          content_html: string | null
          content_text: string | null
          court: string | null
          created_at: string | null
          decision_date: string | null
          external_id: string | null
          id: string
          is_processed: boolean | null
          judges: string[] | null
          keywords: string[] | null
          metadata: Json | null
          parties: Json | null
          source_id: string | null
          summary: string | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          citation?: string | null
          content_hash?: string | null
          content_html?: string | null
          content_text?: string | null
          court?: string | null
          created_at?: string | null
          decision_date?: string | null
          external_id?: string | null
          id?: string
          is_processed?: boolean | null
          judges?: string[] | null
          keywords?: string[] | null
          metadata?: Json | null
          parties?: Json | null
          source_id?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          citation?: string | null
          content_hash?: string | null
          content_html?: string | null
          content_text?: string | null
          court?: string | null
          created_at?: string | null
          decision_date?: string | null
          external_id?: string | null
          id?: string
          is_processed?: boolean | null
          judges?: string[] | null
          keywords?: string[] | null
          metadata?: Json | null
          parties?: Json | null
          source_id?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "legal_documents_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "legal_sources"
            referencedColumns: ["id"]
          },
        ]
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
      legal_sources: {
        Row: {
          base_url: string
          code: string
          country: string
          court_level: string | null
          created_at: string | null
          doc_selector: string | null
          id: string
          is_active: boolean | null
          jurisdiction: string | null
          last_sweep_at: string | null
          listing_selector: string | null
          listing_url: string | null
          metadata: Json | null
          name: string
          rate_limit_ms: number | null
          updated_at: string | null
        }
        Insert: {
          base_url: string
          code: string
          country?: string
          court_level?: string | null
          created_at?: string | null
          doc_selector?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string | null
          last_sweep_at?: string | null
          listing_selector?: string | null
          listing_url?: string | null
          metadata?: Json | null
          name: string
          rate_limit_ms?: number | null
          updated_at?: string | null
        }
        Update: {
          base_url?: string
          code?: string
          country?: string
          court_level?: string | null
          created_at?: string | null
          doc_selector?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string | null
          last_sweep_at?: string | null
          listing_selector?: string | null
          listing_url?: string | null
          metadata?: Json | null
          name?: string
          rate_limit_ms?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      legal_sweep_queue: {
        Row: {
          attempts: number | null
          created_at: string | null
          error: string | null
          id: string
          last_attempt_at: string | null
          metadata: Json | null
          priority: number | null
          source_id: string | null
          status: string | null
          url: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          error?: string | null
          id?: string
          last_attempt_at?: string | null
          metadata?: Json | null
          priority?: number | null
          source_id?: string | null
          status?: string | null
          url: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          error?: string | null
          id?: string
          last_attempt_at?: string | null
          metadata?: Json | null
          priority?: number | null
          source_id?: string | null
          status?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "legal_sweep_queue_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "legal_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_sweep_runs: {
        Row: {
          completed_at: string | null
          docs_found: number | null
          docs_new: number | null
          docs_updated: number | null
          errors: Json | null
          id: string
          metadata: Json | null
          source_id: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          docs_found?: number | null
          docs_new?: number | null
          docs_updated?: number | null
          errors?: Json | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          docs_found?: number | null
          docs_new?: number | null
          docs_updated?: number | null
          errors?: Json | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_sweep_runs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "legal_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_updates: {
        Row: {
          affected_areas: string[] | null
          created_at: string | null
          description: string | null
          effective_date: string | null
          id: string
          is_processed: boolean | null
          jurisdiction: string | null
          source: string
          title: string
          update_type: string
          url: string | null
        }
        Insert: {
          affected_areas?: string[] | null
          created_at?: string | null
          description?: string | null
          effective_date?: string | null
          id?: string
          is_processed?: boolean | null
          jurisdiction?: string | null
          source: string
          title: string
          update_type: string
          url?: string | null
        }
        Update: {
          affected_areas?: string[] | null
          created_at?: string | null
          description?: string | null
          effective_date?: string | null
          id?: string
          is_processed?: boolean | null
          jurisdiction?: string | null
          source?: string
          title?: string
          update_type?: string
          url?: string | null
        }
        Relationships: []
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
          proof_of_income_path: string | null
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
          proof_of_income_path?: string | null
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
          proof_of_income_path?: string | null
          proof_of_income_url?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          case_updates: boolean
          created_at: string
          deadline_reminders: boolean
          email_notifications: boolean
          reminder_days_before: number
          updated_at: string
          user_id: string
        }
        Insert: {
          case_updates?: boolean
          created_at?: string
          deadline_reminders?: boolean
          email_notifications?: boolean
          reminder_days_before?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          case_updates?: boolean
          created_at?: string
          deadline_reminders?: boolean
          email_notifications?: boolean
          reminder_days_before?: number
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
          related_case_id: string | null
          related_event_id: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_case_id?: string | null
          related_event_id?: string | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_case_id?: string | null
          related_event_id?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          anon_id: string | null
          country: string | null
          id: string
          occurred_at: string
          path: string
          referrer: string | null
          session_id: string | null
          site: string
          url: string
          user_agent: string | null
        }
        Insert: {
          anon_id?: string | null
          country?: string | null
          id?: string
          occurred_at?: string
          path: string
          referrer?: string | null
          session_id?: string | null
          site?: string
          url: string
          user_agent?: string | null
        }
        Update: {
          anon_id?: string | null
          country?: string | null
          id?: string
          occurred_at?: string
          path?: string
          referrer?: string | null
          session_id?: string | null
          site?: string
          url?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      pathway_routing_results: {
        Row: {
          alternative_pathways: Json | null
          case_id: string | null
          confidence_score: number
          created_at: string
          facts: Json
          id: string
          matched_rules: Json
          reasoning: string[]
          recommended_forms: string[]
          recommended_pathway: string
          recommended_tribunal: string
          user_id: string | null
        }
        Insert: {
          alternative_pathways?: Json | null
          case_id?: string | null
          confidence_score: number
          created_at?: string
          facts: Json
          id?: string
          matched_rules: Json
          reasoning?: string[]
          recommended_forms?: string[]
          recommended_pathway: string
          recommended_tribunal: string
          user_id?: string | null
        }
        Update: {
          alternative_pathways?: Json | null
          case_id?: string | null
          confidence_score?: number
          created_at?: string
          facts?: Json
          id?: string
          matched_rules?: Json
          reasoning?: string[]
          recommended_forms?: string[]
          recommended_pathway?: string
          recommended_tribunal?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pathway_routing_results_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      pathway_rules: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          category: string | null
          created_at: string
          filing_fee: string | null
          id: string
          is_active: boolean
          issue_keywords: string[]
          pathway_id: string
          priority: number
          province: string | null
          reasoning: string
          recommended_forms: string[]
          rule_name: string
          success_rate: number | null
          timeframe: string | null
          tribunal: string
          updated_at: string
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          category?: string | null
          created_at?: string
          filing_fee?: string | null
          id?: string
          is_active?: boolean
          issue_keywords?: string[]
          pathway_id: string
          priority?: number
          province?: string | null
          reasoning: string
          recommended_forms?: string[]
          rule_name: string
          success_rate?: number | null
          timeframe?: string | null
          tribunal: string
          updated_at?: string
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          category?: string | null
          created_at?: string
          filing_fee?: string | null
          id?: string
          is_active?: boolean
          issue_keywords?: string[]
          pathway_id?: string
          priority?: number
          province?: string | null
          reasoning?: string
          recommended_forms?: string[]
          rule_name?: string
          success_rate?: number | null
          timeframe?: string | null
          tribunal?: string
          updated_at?: string
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
          amount_cents: number | null
          captured_at: string | null
          case_id: string | null
          created_at: string
          currency: string
          form_id: string | null
          id: string
          metadata: Json | null
          payer_id: string | null
          payment_id: string
          payment_provider: string
          paypal_response: Json | null
          plan_type: string
          provider: string | null
          provider_order_id: string | null
          provider_txn_id: string | null
          raw: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          amount_cents?: number | null
          captured_at?: string | null
          case_id?: string | null
          created_at?: string
          currency?: string
          form_id?: string | null
          id?: string
          metadata?: Json | null
          payer_id?: string | null
          payment_id: string
          payment_provider?: string
          paypal_response?: Json | null
          plan_type: string
          provider?: string | null
          provider_order_id?: string | null
          provider_txn_id?: string | null
          raw?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          amount_cents?: number | null
          captured_at?: string | null
          case_id?: string | null
          created_at?: string
          currency?: string
          form_id?: string | null
          id?: string
          metadata?: Json | null
          payer_id?: string | null
          payment_id?: string
          payment_provider?: string
          paypal_response?: Json | null
          plan_type?: string
          provider?: string | null
          provider_order_id?: string | null
          provider_txn_id?: string | null
          raw?: Json | null
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
          {
            foreignKeyName: "payments_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
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
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean | null
          phone: string | null
          signup_number: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          signup_number?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          signup_number?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          total_credits_earned: number
          user_id: string
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          total_credits_earned?: number
          user_id: string
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          total_credits_earned?: number
          user_id?: string
          uses_count?: number
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          credit_amount: number
          credited_at: string | null
          id: string
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
          status: string
        }
        Insert: {
          created_at?: string
          credit_amount?: number
          credited_at?: string | null
          id?: string
          referral_code: string
          referred_user_id: string
          referrer_user_id: string
          status?: string
        }
        Update: {
          created_at?: string
          credit_amount?: number
          credited_at?: string | null
          id?: string
          referral_code?: string
          referred_user_id?: string
          referrer_user_id?: string
          status?: string
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          content: string
          conversions: number | null
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          faq: Json | null
          form_type: string | null
          h1: string
          id: string
          location: string | null
          meta_description: string | null
          slug: string
          title: string
          topic: string | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          content: string
          conversions?: number | null
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          faq?: Json | null
          form_type?: string | null
          h1: string
          id?: string
          location?: string | null
          meta_description?: string | null
          slug: string
          title: string
          topic?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          content?: string
          conversions?: number | null
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          faq?: Json | null
          form_type?: string | null
          h1?: string
          id?: string
          location?: string | null
          meta_description?: string | null
          slug?: string
          title?: string
          topic?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          sender_name: string
          sender_type: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          sender_name: string
          sender_type: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          sender_name?: string
          sender_type?: string
          ticket_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string
          id: string
          name: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          case_id: string | null
          case_type: string
          created_at: string
          featured: boolean | null
          id: string
          location: string | null
          name: string
          outcome: string | null
          rating: number
          status: string
          story: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          case_id?: string | null
          case_type: string
          created_at?: string
          featured?: boolean | null
          id?: string
          location?: string | null
          name: string
          outcome?: string | null
          rating: number
          status?: string
          story: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          case_id?: string | null
          case_type?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          location?: string | null
          name?: string
          outcome?: string | null
          rating?: number
          status?: string
          story?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          event_date: string
          event_time: string | null
          evidence_ids: string[] | null
          id: string
          importance: string | null
          notes: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date: string
          event_time?: string | null
          evidence_ids?: string[] | null
          id?: string
          importance?: string | null
          notes?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          evidence_ids?: string[] | null
          id?: string
          importance?: string | null
          notes?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tutorial_videos: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          is_active: boolean
          pathway_type: string
          step_number: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
          view_count: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_active?: boolean
          pathway_type: string
          step_number?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
          view_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_active?: boolean
          pathway_type?: string
          step_number?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
          view_count?: number
        }
        Relationships: []
      }
      upsell_prompts: {
        Row: {
          action_taken: string | null
          created_at: string | null
          id: string
          prompt_type: string
          shown_at: string | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          prompt_type: string
          shown_at?: string | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          prompt_type?: string
          shown_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_agreements: {
        Row: {
          agreed_to_disclaimer: boolean
          agreed_to_liability: boolean
          agreed_to_privacy: boolean
          agreed_to_terms: boolean
          agreement_date: string
          created_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          agreed_to_disclaimer?: boolean
          agreed_to_liability?: boolean
          agreed_to_privacy?: boolean
          agreed_to_terms?: boolean
          agreement_date?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          agreed_to_disclaimer?: boolean
          agreed_to_liability?: boolean
          agreed_to_privacy?: boolean
          agreed_to_terms?: boolean
          agreement_date?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          source: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          source: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          source?: string
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
      user_profiles: {
        Row: {
          auth_user_id: string
          created_at: string
          is_paid: boolean
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          is_paid?: boolean
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          is_paid?: boolean
          updated_at?: string
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
      user_settings: {
        Row: {
          captions_enabled: boolean
          color_scheme: string
          font_scale: number
          prefers_high_contrast: boolean
          prefers_reduced_motion: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          captions_enabled?: boolean
          color_scheme?: string
          font_scale?: number
          prefers_high_contrast?: boolean
          prefers_reduced_motion?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          captions_enabled?: boolean
          color_scheme?: string
          font_scale?: number
          prefers_high_contrast?: boolean
          prefers_reduced_motion?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admins_public_meta: {
        Row: {
          granted_at: string | null
          revoked_at: string | null
          user_id: string | null
        }
        Insert: {
          granted_at?: string | null
          revoked_at?: string | null
          user_id?: string | null
        }
        Update: {
          granted_at?: string | null
          revoked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      legal_pathways_admin_view: {
        Row: {
          case_id: string | null
          confidence_score: number | null
          created_at: string | null
          id: string | null
          next_steps: Json | null
          pathway_type: string | null
          relevant_laws: Json | null
        }
        Insert: {
          case_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string | null
          next_steps?: Json | null
          pathway_type?: string | null
          relevant_laws?: Json | null
        }
        Update: {
          case_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string | null
          next_steps?: Json | null
          pathway_type?: string | null
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
      legal_pathways_monthly_analytics: {
        Row: {
          active_users: number | null
          avg_merit_score: number | null
          completed_documents: number | null
          conversion_rate_pct: number | null
          month: string | null
          pathway_type: string | null
          total_cases: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      my_payments: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles_directory: {
        Row: {
          avatar_url: string | null
          bio_preview: string | null
          display_name: string | null
          id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio_preview?: never
          display_name?: string | null
          id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio_preview?: never
          display_name?: string | null
          id?: string | null
        }
        Relationships: []
      }
      profiles_public: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string | null
        }
        Relationships: []
      }
      profiles_public_view: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _request_context: { Args: never; Returns: Json }
      admin_delete_low_income_application: {
        Args: { p_admin_note?: string; p_id: string }
        Returns: undefined
      }
      admin_list_low_income_applications: {
        Args: { p_status?: string }
        Returns: {
          annual_income: number
          created_at: string
          email: string
          employment_status: string
          full_name: string
          household_size: number
          id: string
          phone: string | null
          proof_of_income_path: string | null
          proof_of_income_url: string
          status: string
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "low_income_applications"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_list_profiles_guard: {
        Args: { p_limit?: number; p_offset?: number; p_search?: string }
        Returns: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean | null
          phone: string | null
          signup_number: number | null
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_update_low_income_application_status: {
        Args: { p_admin_note?: string; p_id: string; p_new_status: string }
        Returns: {
          annual_income: number
          created_at: string
          email: string
          employment_status: string
          full_name: string
          household_size: number
          id: string
          phone: string | null
          proof_of_income_path: string | null
          proof_of_income_url: string
          status: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "low_income_applications"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      can_access_case_event: { Args: { p_case_id: string }; Returns: boolean }
      check_free_tier_eligibility: { Args: never; Returns: boolean }
      debug_auth_claims: {
        Args: never
        Returns: {
          email: string
          is_admin: boolean
          org_id: string
          raw_jwt: Json
          roles: string[]
          tenant_id: string
          uid: string
          user_role: string
        }[]
      }
      debug_auth_context: {
        Args: never
        Returns: {
          is_admin: boolean
          raw_jwt: Json
          uid: string
        }[]
      }
      ensure_admin_bypass_policies: {
        Args: { target_schemas?: string[] }
        Returns: undefined
      }
      get_admins_meta_secure: {
        Args: never
        Returns: {
          granted_at: string
          revoked_at: string
          user_id: string
        }[]
      }
      get_admins_public_meta: {
        Args: never
        Returns: {
          granted_at: string
          revoked_at: string
          user_id: string
        }[]
      }
      get_all_admins: {
        Args: never
        Returns: {
          email: string
          granted_at: string
          granted_by: string
          is_active: boolean
          notes: string
          revoked_at: string
          user_id: string
        }[]
      }
      get_all_users_admin: {
        Args: never
        Returns: {
          cases_count: number
          created_at: string
          display_name: string
          email: string
          email_confirmed_at: string
          id: string
          last_sign_in_at: string
        }[]
      }
      get_lia_by_id: {
        Args: { p_id: string }
        Returns: {
          annual_income: number
          created_at: string
          email: string
          employment_status: string
          full_name: string
          household_size: number
          id: string
          phone: string | null
          proof_of_income_path: string | null
          proof_of_income_url: string
          status: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "low_income_applications"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_platform_analytics: {
        Args: { end_date?: string; start_date?: string }
        Returns: Json
      }
      get_recent_usage_counts: {
        Args: {
          p_ip_address: string
          p_route: string
          p_user_id: string
          p_window_days: number
          p_window_minutes: number
        }
        Returns: {
          ip_daily_count: number
          ip_window_count: number
          user_daily_count: number
          user_window_count: number
        }[]
      }
      grant_admin_role: {
        Args: { admin_notes?: string; target_user_id: string }
        Returns: undefined
      }
      has_role:
        | {
            Args: { _role: Database["public"]["Enums"]["app_role"] }
            Returns: boolean
          }
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
      increment_api_usage:
        | {
            Args: { p_ip_address: string; p_route: string; p_user_id: string }
            Returns: undefined
          }
        | {
            Args: {
              p_inc?: number
              p_ip: unknown
              p_route: string
              p_user_id: string
            }
            Returns: {
              daily_limit: number
              limit_exceeded: boolean
              usage_count: number
            }[]
          }
      increment_form_usage: {
        Args: { form_id_input: string }
        Returns: undefined
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { p_user_id: string }; Returns: boolean }
      is_owner: { Args: never; Returns: boolean }
      lia_log: {
        Args: { action: string; application_id: string; details: Json }
        Returns: undefined
      }
      log_admins_access: {
        Args: { p_action: string; p_details?: Json; p_success: boolean }
        Returns: undefined
      }
      make_user_admin: { Args: { p_email: string }; Returns: undefined }
      revoke_admin_role: {
        Args: { revoke_reason?: string; target_user_id: string }
        Returns: undefined
      }
      search_profiles_directory: {
        Args: { p_limit?: number; p_offset?: number; p_query?: string }
        Returns: {
          avatar_url: string
          bio_preview: string
          display_name: string
          id: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      user_has_role: { Args: { target_role: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "owner"
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
      app_role: ["admin", "moderator", "user", "owner"],
    },
  },
} as const
