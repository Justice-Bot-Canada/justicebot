create type "public"."app_role" as enum ('admin', 'moderator', 'user');

create sequence "public"."orders_id_seq";

create sequence "public"."signup_number_seq";

create sequence "public"."stripe_webhook_events_id_seq";


  create table "public"."analytics_events" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "event_type" text not null,
    "event_data" jsonb,
    "page_url" text,
    "session_id" text,
    "created_at" timestamp with time zone not null default now(),
    "metrics" jsonb
      );


alter table "public"."analytics_events" enable row level security;


  create table "public"."case_deadlines" (
    "id" uuid not null default gen_random_uuid(),
    "case_id" uuid not null,
    "title" text not null,
    "description" text,
    "due_date" timestamp with time zone not null,
    "priority" text default 'medium'::text,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "completed" boolean default false,
    "user_id" uuid
      );


alter table "public"."case_deadlines" enable row level security;


  create table "public"."case_events" (
    "id" uuid not null default gen_random_uuid(),
    "case_id" uuid not null,
    "title" text not null,
    "description" text,
    "event_date" timestamp with time zone not null,
    "event_type" text not null default 'general'::text,
    "priority" text default 'medium'::text,
    "location" text,
    "reminder_sent" boolean default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "status" text default 'scheduled'::text
      );


alter table "public"."case_events" enable row level security;


  create table "public"."case_milestones" (
    "id" uuid not null default gen_random_uuid(),
    "case_id" uuid not null,
    "milestone_type" text not null,
    "title" text not null,
    "description" text,
    "completed" boolean default false,
    "completed_at" timestamp with time zone,
    "order_index" integer default 0,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."case_milestones" enable row level security;


  create table "public"."cases" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "description" text,
    "province" text not null,
    "municipality" text,
    "law_section" text,
    "merit_score" integer default 0,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "venue" text,
    "flow_step" text,
    "triage_complete" boolean default false,
    "timeline_viewed" boolean default false,
    "triage" jsonb,
    "is_paid" boolean default false
      );


alter table "public"."cases" enable row level security;


  create table "public"."document_templates" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "category" text not null,
    "template_type" text not null,
    "file_path" text,
    "preview_content" text,
    "download_count" integer default 0,
    "is_premium" boolean default false,
    "province" text,
    "created_at" timestamp with time zone not null default now(),
    "tags" text[]
      );


alter table "public"."document_templates" enable row level security;


  create table "public"."documents" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "case_id" uuid,
    "form_key" text,
    "title" text not null,
    "content" text,
    "file_path" text,
    "file_type" text,
    "status" text default 'draft'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."documents" enable row level security;


  create table "public"."entitlements" (
    "user_id" uuid not null,
    "product_id" text not null,
    "access_level" text not null default 'paid'::text,
    "source" text not null default 'stripe'::text,
    "starts_at" timestamp with time zone not null default now(),
    "ends_at" timestamp with time zone,
    "updated_at" timestamp with time zone not null default now(),
    "case_id" uuid
      );


alter table "public"."entitlements" enable row level security;


  create table "public"."evidence" (
    "id" uuid not null default gen_random_uuid(),
    "case_id" uuid not null,
    "file_name" text not null,
    "file_path" text not null,
    "file_type" text not null,
    "description" text,
    "upload_date" timestamp with time zone not null default now(),
    "tags" text[] default '{}'::text[],
    "page_count" integer default 1,
    "ocr_text" text,
    "order_index" integer default 0,
    "redacted_regions" jsonb default '[]'::jsonb
      );


alter table "public"."evidence" enable row level security;


  create table "public"."evidence_analysis" (
    "id" uuid not null default gen_random_uuid(),
    "evidence_id" uuid not null,
    "analysis_data" jsonb,
    "summary" text,
    "relevance_score" integer,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."evidence_analysis" enable row level security;


  create table "public"."evidence_metadata" (
    "id" uuid not null default gen_random_uuid(),
    "evidence_id" uuid not null,
    "key" text not null,
    "value" text,
    "created_at" timestamp with time zone not null default now(),
    "doc_type" text,
    "category" text,
    "parties" jsonb,
    "dates" jsonb,
    "extracted_text" text,
    "confidence_score" numeric,
    "flags" jsonb
      );


alter table "public"."evidence_metadata" enable row level security;


  create table "public"."features" (
    "key" text not null,
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."features" enable row level security;


  create table "public"."form_usage" (
    "id" uuid not null default gen_random_uuid(),
    "form_id" uuid not null,
    "user_id" uuid,
    "case_id" uuid,
    "completion_status" text default 'started'::text,
    "field_data" jsonb,
    "completion_time_minutes" integer,
    "success_rating" integer,
    "feedback" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."form_usage" enable row level security;


  create table "public"."forms" (
    "id" uuid not null default gen_random_uuid(),
    "form_code" text not null,
    "title" text not null,
    "description" text,
    "category" text not null,
    "tribunal_type" text not null,
    "price_cents" integer not null default 0,
    "is_active" boolean not null default true,
    "form_fields" jsonb,
    "instructions" text,
    "filing_requirements" jsonb,
    "usage_count" integer default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "pdf_url" text,
    "purchasable" boolean default false
      );


alter table "public"."forms" enable row level security;


  create table "public"."healthcheck" (
    "id" bigint generated always as identity not null,
    "created_at" timestamp with time zone not null default now()
      );



  create table "public"."leads" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "email" text not null,
    "name" text,
    "phone" text,
    "source" text,
    "status" text default 'new'::text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."leads" enable row level security;


  create table "public"."legal_pathways" (
    "id" uuid not null default gen_random_uuid(),
    "case_id" uuid not null,
    "pathway_type" text not null,
    "recommendation" text not null,
    "confidence_score" integer not null default 0,
    "relevant_laws" jsonb,
    "next_steps" jsonb,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."legal_pathways" enable row level security;


  create table "public"."low_income_applications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "full_name" text not null,
    "email" text not null,
    "phone" text,
    "annual_income" integer not null,
    "household_size" integer not null,
    "employment_status" text not null,
    "proof_of_income_url" text not null,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."low_income_applications" enable row level security;


  create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "message" text,
    "type" text default 'info'::text,
    "read" boolean default false,
    "link" text,
    "created_at" timestamp with time zone not null default now(),
    "action_url" text
      );


alter table "public"."notifications" enable row level security;


  create table "public"."orders" (
    "id" bigint not null default nextval('public.orders_id_seq'::regclass),
    "user_id" uuid,
    "stripe_checkout_session_id" text,
    "stripe_payment_intent_id" text,
    "stripe_subscription_id" text,
    "price_id" text,
    "amount_total" integer,
    "currency" text,
    "status" text not null default 'created'::text,
    "created_at" timestamp with time zone not null default now(),
    "paid_at" timestamp with time zone
      );


alter table "public"."orders" enable row level security;


  create table "public"."payments" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "form_id" uuid,
    "amount" integer not null,
    "currency" text default 'cad'::text,
    "status" text default 'pending'::text,
    "stripe_payment_id" text,
    "created_at" timestamp with time zone not null default now(),
    "payment_id" text,
    "plan_type" text,
    "captured_at" timestamp with time zone
      );


alter table "public"."payments" enable row level security;


  create table "public"."plan_features" (
    "product_id" text not null,
    "feature_key" text not null,
    "value" jsonb not null default '{}'::jsonb
      );


alter table "public"."plan_features" enable row level security;


  create table "public"."prices" (
    "id" text not null,
    "product_id" text not null,
    "stripe_price_id" text not null,
    "currency" text not null default 'cad'::text,
    "unit_amount" integer not null,
    "interval" text,
    "active" boolean not null default true,
    "metadata" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."prices" enable row level security;


  create table "public"."products" (
    "id" text not null,
    "name" text not null,
    "active" boolean not null default true,
    "metadata" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."products" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "display_name" text,
    "first_name" text,
    "last_name" text,
    "avatar_url" text,
    "phone" text,
    "bio" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "onboarding_completed" boolean default false,
    "selected_province" text
      );


alter table "public"."profiles" enable row level security;


  create table "public"."programs" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "name" text not null,
    "description" text,
    "organization" text,
    "logo_url" text,
    "primary_color" text,
    "secondary_color" text,
    "welcome_message" text,
    "disclaimer_text" text,
    "contact_email" text,
    "contact_phone" text,
    "is_active" boolean default true,
    "settings" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "disable_pricing" boolean default false,
    "disable_ai_beyond_procedural" boolean default false,
    "show_no_legal_advice_banner" boolean default true,
    "cohort_batch" text,
    "max_users" integer,
    "expires_at" timestamp with time zone,
    "custom_fields" jsonb default '{}'::jsonb,
    "max_referrals" integer,
    "referral_count" integer default 0,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."programs" enable row level security;


  create table "public"."referral_codes" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "code" text not null,
    "uses" integer default 0,
    "max_uses" integer,
    "discount_percent" integer default 10,
    "created_at" timestamp with time zone not null default now(),
    "uses_count" integer default 0,
    "total_credits_earned" integer default 0
      );


alter table "public"."referral_codes" enable row level security;


  create table "public"."referrals" (
    "id" uuid not null default gen_random_uuid(),
    "referrer_id" uuid not null,
    "referred_id" uuid,
    "referral_code_id" uuid,
    "status" text default 'pending'::text,
    "reward_amount" integer,
    "created_at" timestamp with time zone not null default now(),
    "credit_amount" integer
      );


alter table "public"."referrals" enable row level security;


  create table "public"."saved_documents" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "case_id" uuid,
    "title" text not null,
    "document_type" text,
    "content" text,
    "file_path" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."saved_documents" enable row level security;


  create table "public"."stripe_customers" (
    "user_id" uuid not null,
    "stripe_customer_id" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."stripe_customers" enable row level security;


  create table "public"."stripe_webhook_events" (
    "id" bigint not null default nextval('public.stripe_webhook_events_id_seq'::regclass),
    "stripe_event_id" text not null,
    "type" text not null,
    "livemode" boolean not null,
    "payload" jsonb not null,
    "received_at" timestamp with time zone not null default now(),
    "processed_at" timestamp with time zone,
    "processing_error" text
      );


alter table "public"."stripe_webhook_events" enable row level security;


  create table "public"."support_messages" (
    "id" uuid not null default gen_random_uuid(),
    "ticket_id" uuid not null,
    "user_id" uuid,
    "sender_type" text not null default 'user'::text,
    "message" text not null,
    "created_at" timestamp with time zone not null default now(),
    "sender_name" text,
    "content" text
      );


alter table "public"."support_messages" enable row level security;


  create table "public"."support_tickets" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "subject" text not null,
    "description" text,
    "status" text default 'open'::text,
    "priority" text default 'medium'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "email" text,
    "name" text
      );


alter table "public"."support_tickets" enable row level security;


  create table "public"."testimonials" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "name" text not null,
    "role" text,
    "content" text not null,
    "rating" integer default 5,
    "is_approved" boolean default false,
    "avatar_url" text,
    "created_at" timestamp with time zone not null default now(),
    "location" text,
    "case_type" text,
    "story" text,
    "outcome" text,
    "status" text default 'pending'::text,
    "featured" boolean default false
      );


alter table "public"."testimonials" enable row level security;


  create table "public"."timeline_events" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "description" text,
    "event_date" timestamp with time zone not null,
    "event_time" text,
    "category" text default 'general'::text,
    "importance" text default 'medium'::text,
    "notes" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."timeline_events" enable row level security;


  create table "public"."tutorial_videos" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "video_url" text not null,
    "thumbnail_url" text,
    "category" text,
    "duration_seconds" integer,
    "is_premium" boolean default false,
    "view_count" integer default 0,
    "order_index" integer default 0,
    "created_at" timestamp with time zone not null default now(),
    "pathway_type" text,
    "step_number" integer
      );


alter table "public"."tutorial_videos" enable row level security;


  create table "public"."user_credits" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "amount" integer default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."user_credits" enable row level security;


  create table "public"."user_feedback" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "rating" integer,
    "feedback_type" text,
    "message" text,
    "page_url" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."user_feedback" enable row level security;


  create table "public"."user_preferences" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "email_notifications" boolean default true,
    "deadline_reminders" boolean default true,
    "marketing_emails" boolean default false,
    "theme" text default 'light'::text,
    "language" text default 'en'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."user_preferences" enable row level security;


  create table "public"."user_roles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "role" public.app_role not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."user_roles" enable row level security;

alter sequence "public"."orders_id_seq" owned by "public"."orders"."id";

alter sequence "public"."stripe_webhook_events_id_seq" owned by "public"."stripe_webhook_events"."id";

CREATE UNIQUE INDEX analytics_events_pkey ON public.analytics_events USING btree (id);

CREATE UNIQUE INDEX case_deadlines_pkey ON public.case_deadlines USING btree (id);

CREATE UNIQUE INDEX case_events_pkey ON public.case_events USING btree (id);

CREATE UNIQUE INDEX case_milestones_pkey ON public.case_milestones USING btree (id);

CREATE UNIQUE INDEX cases_pkey ON public.cases USING btree (id);

CREATE UNIQUE INDEX document_templates_pkey ON public.document_templates USING btree (id);

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

CREATE UNIQUE INDEX entitlements_pkey ON public.entitlements USING btree (user_id, product_id);

CREATE INDEX entitlements_user_idx ON public.entitlements USING btree (user_id);

CREATE UNIQUE INDEX evidence_analysis_pkey ON public.evidence_analysis USING btree (id);

CREATE UNIQUE INDEX evidence_metadata_pkey ON public.evidence_metadata USING btree (id);

CREATE UNIQUE INDEX evidence_pkey ON public.evidence USING btree (id);

CREATE UNIQUE INDEX features_pkey ON public.features USING btree (key);

CREATE UNIQUE INDEX form_usage_pkey ON public.form_usage USING btree (id);

CREATE UNIQUE INDEX forms_form_code_key ON public.forms USING btree (form_code);

CREATE UNIQUE INDEX forms_pkey ON public.forms USING btree (id);

CREATE UNIQUE INDEX healthcheck_pkey ON public.healthcheck USING btree (id);

CREATE INDEX idx_entitlements_user_active ON public.entitlements USING btree (user_id, ends_at);

CREATE INDEX idx_evidence_ocr_text ON public.evidence USING gin (to_tsvector('english'::regconfig, COALESCE(ocr_text, ''::text)));

CREATE INDEX idx_evidence_order_index ON public.evidence USING btree (case_id, order_index);

CREATE INDEX idx_evidence_tags ON public.evidence USING gin (tags);

CREATE INDEX idx_plan_features_feature ON public.plan_features USING btree (feature_key);

CREATE UNIQUE INDEX leads_pkey ON public.leads USING btree (id);

CREATE UNIQUE INDEX legal_pathways_pkey ON public.legal_pathways USING btree (id);

CREATE UNIQUE INDEX low_income_applications_pkey ON public.low_income_applications USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE INDEX orders_session_idx ON public.orders USING btree (stripe_checkout_session_id);

CREATE UNIQUE INDEX orders_stripe_checkout_session_id_key ON public.orders USING btree (stripe_checkout_session_id);

CREATE UNIQUE INDEX orders_stripe_checkout_session_id_unique ON public.orders USING btree (stripe_checkout_session_id);

CREATE INDEX orders_user_id_idx ON public.orders USING btree (user_id);

CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id);

CREATE UNIQUE INDEX plan_features_pkey ON public.plan_features USING btree (product_id, feature_key);

CREATE UNIQUE INDEX prices_pkey ON public.prices USING btree (id);

CREATE UNIQUE INDEX prices_stripe_price_id_key ON public.prices USING btree (stripe_price_id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_user_id_key ON public.profiles USING btree (user_id);

CREATE UNIQUE INDEX programs_pkey ON public.programs USING btree (id);

CREATE UNIQUE INDEX programs_slug_key ON public.programs USING btree (slug);

CREATE UNIQUE INDEX referral_codes_code_key ON public.referral_codes USING btree (code);

CREATE UNIQUE INDEX referral_codes_pkey ON public.referral_codes USING btree (id);

CREATE UNIQUE INDEX referrals_pkey ON public.referrals USING btree (id);

CREATE UNIQUE INDEX saved_documents_pkey ON public.saved_documents USING btree (id);

CREATE UNIQUE INDEX stripe_customers_pkey ON public.stripe_customers USING btree (user_id);

CREATE UNIQUE INDEX stripe_customers_stripe_customer_id_key ON public.stripe_customers USING btree (stripe_customer_id);

CREATE UNIQUE INDEX stripe_webhook_events_event_id_unique ON public.stripe_webhook_events USING btree (stripe_event_id);

CREATE UNIQUE INDEX stripe_webhook_events_pkey ON public.stripe_webhook_events USING btree (id);

CREATE UNIQUE INDEX stripe_webhook_events_stripe_event_id_key ON public.stripe_webhook_events USING btree (stripe_event_id);

CREATE INDEX stripe_webhook_events_type_idx ON public.stripe_webhook_events USING btree (type);

CREATE UNIQUE INDEX support_messages_pkey ON public.support_messages USING btree (id);

CREATE UNIQUE INDEX support_tickets_pkey ON public.support_tickets USING btree (id);

CREATE UNIQUE INDEX testimonials_pkey ON public.testimonials USING btree (id);

CREATE UNIQUE INDEX timeline_events_pkey ON public.timeline_events USING btree (id);

CREATE UNIQUE INDEX tutorial_videos_pkey ON public.tutorial_videos USING btree (id);

CREATE UNIQUE INDEX user_credits_pkey ON public.user_credits USING btree (id);

CREATE UNIQUE INDEX user_credits_user_id_key ON public.user_credits USING btree (user_id);

CREATE UNIQUE INDEX user_feedback_pkey ON public.user_feedback USING btree (id);

CREATE UNIQUE INDEX user_preferences_pkey ON public.user_preferences USING btree (id);

CREATE UNIQUE INDEX user_preferences_user_id_key ON public.user_preferences USING btree (user_id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (id);

CREATE UNIQUE INDEX user_roles_user_id_role_key ON public.user_roles USING btree (user_id, role);

alter table "public"."analytics_events" add constraint "analytics_events_pkey" PRIMARY KEY using index "analytics_events_pkey";

alter table "public"."case_deadlines" add constraint "case_deadlines_pkey" PRIMARY KEY using index "case_deadlines_pkey";

alter table "public"."case_events" add constraint "case_events_pkey" PRIMARY KEY using index "case_events_pkey";

alter table "public"."case_milestones" add constraint "case_milestones_pkey" PRIMARY KEY using index "case_milestones_pkey";

alter table "public"."cases" add constraint "cases_pkey" PRIMARY KEY using index "cases_pkey";

alter table "public"."document_templates" add constraint "document_templates_pkey" PRIMARY KEY using index "document_templates_pkey";

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."entitlements" add constraint "entitlements_pkey" PRIMARY KEY using index "entitlements_pkey";

alter table "public"."evidence" add constraint "evidence_pkey" PRIMARY KEY using index "evidence_pkey";

alter table "public"."evidence_analysis" add constraint "evidence_analysis_pkey" PRIMARY KEY using index "evidence_analysis_pkey";

alter table "public"."evidence_metadata" add constraint "evidence_metadata_pkey" PRIMARY KEY using index "evidence_metadata_pkey";

alter table "public"."features" add constraint "features_pkey" PRIMARY KEY using index "features_pkey";

alter table "public"."form_usage" add constraint "form_usage_pkey" PRIMARY KEY using index "form_usage_pkey";

alter table "public"."forms" add constraint "forms_pkey" PRIMARY KEY using index "forms_pkey";

alter table "public"."healthcheck" add constraint "healthcheck_pkey" PRIMARY KEY using index "healthcheck_pkey";

alter table "public"."leads" add constraint "leads_pkey" PRIMARY KEY using index "leads_pkey";

alter table "public"."legal_pathways" add constraint "legal_pathways_pkey" PRIMARY KEY using index "legal_pathways_pkey";

alter table "public"."low_income_applications" add constraint "low_income_applications_pkey" PRIMARY KEY using index "low_income_applications_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."payments" add constraint "payments_pkey" PRIMARY KEY using index "payments_pkey";

alter table "public"."plan_features" add constraint "plan_features_pkey" PRIMARY KEY using index "plan_features_pkey";

alter table "public"."prices" add constraint "prices_pkey" PRIMARY KEY using index "prices_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."programs" add constraint "programs_pkey" PRIMARY KEY using index "programs_pkey";

alter table "public"."referral_codes" add constraint "referral_codes_pkey" PRIMARY KEY using index "referral_codes_pkey";

alter table "public"."referrals" add constraint "referrals_pkey" PRIMARY KEY using index "referrals_pkey";

alter table "public"."saved_documents" add constraint "saved_documents_pkey" PRIMARY KEY using index "saved_documents_pkey";

alter table "public"."stripe_customers" add constraint "stripe_customers_pkey" PRIMARY KEY using index "stripe_customers_pkey";

alter table "public"."stripe_webhook_events" add constraint "stripe_webhook_events_pkey" PRIMARY KEY using index "stripe_webhook_events_pkey";

alter table "public"."support_messages" add constraint "support_messages_pkey" PRIMARY KEY using index "support_messages_pkey";

alter table "public"."support_tickets" add constraint "support_tickets_pkey" PRIMARY KEY using index "support_tickets_pkey";

alter table "public"."testimonials" add constraint "testimonials_pkey" PRIMARY KEY using index "testimonials_pkey";

alter table "public"."timeline_events" add constraint "timeline_events_pkey" PRIMARY KEY using index "timeline_events_pkey";

alter table "public"."tutorial_videos" add constraint "tutorial_videos_pkey" PRIMARY KEY using index "tutorial_videos_pkey";

alter table "public"."user_credits" add constraint "user_credits_pkey" PRIMARY KEY using index "user_credits_pkey";

alter table "public"."user_feedback" add constraint "user_feedback_pkey" PRIMARY KEY using index "user_feedback_pkey";

alter table "public"."user_preferences" add constraint "user_preferences_pkey" PRIMARY KEY using index "user_preferences_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."analytics_events" add constraint "analytics_events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."analytics_events" validate constraint "analytics_events_user_id_fkey";

alter table "public"."case_deadlines" add constraint "case_deadlines_case_id_fkey" FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE not valid;

alter table "public"."case_deadlines" validate constraint "case_deadlines_case_id_fkey";

alter table "public"."case_deadlines" add constraint "case_deadlines_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."case_deadlines" validate constraint "case_deadlines_user_id_fkey";

alter table "public"."case_events" add constraint "case_events_case_id_fkey" FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE not valid;

alter table "public"."case_events" validate constraint "case_events_case_id_fkey";

alter table "public"."case_milestones" add constraint "case_milestones_case_id_fkey" FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE not valid;

alter table "public"."case_milestones" validate constraint "case_milestones_case_id_fkey";

alter table "public"."cases" add constraint "cases_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'analyzing'::text, 'completed'::text, 'archived'::text]))) not valid;

alter table "public"."cases" validate constraint "cases_status_check";

alter table "public"."documents" add constraint "documents_case_id_fkey" FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE SET NULL not valid;

alter table "public"."documents" validate constraint "documents_case_id_fkey";

alter table "public"."documents" add constraint "documents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."documents" validate constraint "documents_user_id_fkey";

alter table "public"."entitlements" add constraint "entitlements_case_id_fkey" FOREIGN KEY (case_id) REFERENCES public.cases(id) not valid;

alter table "public"."entitlements" validate constraint "entitlements_case_id_fkey";

alter table "public"."entitlements" add constraint "entitlements_ends_after_starts_check" CHECK (((ends_at IS NULL) OR (ends_at > starts_at))) not valid;

alter table "public"."entitlements" validate constraint "entitlements_ends_after_starts_check";

alter table "public"."entitlements" add constraint "entitlements_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."entitlements" validate constraint "entitlements_product_id_fkey";

alter table "public"."entitlements" add constraint "entitlements_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."entitlements" validate constraint "entitlements_user_id_fkey";

alter table "public"."evidence" add constraint "evidence_case_id_fkey" FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE not valid;

alter table "public"."evidence" validate constraint "evidence_case_id_fkey";

alter table "public"."evidence_analysis" add constraint "evidence_analysis_evidence_id_fkey" FOREIGN KEY (evidence_id) REFERENCES public.evidence(id) ON DELETE CASCADE not valid;

alter table "public"."evidence_analysis" validate constraint "evidence_analysis_evidence_id_fkey";

alter table "public"."evidence_metadata" add constraint "evidence_metadata_evidence_id_fkey" FOREIGN KEY (evidence_id) REFERENCES public.evidence(id) ON DELETE CASCADE not valid;

alter table "public"."evidence_metadata" validate constraint "evidence_metadata_evidence_id_fkey";

alter table "public"."form_usage" add constraint "form_usage_case_id_fkey" FOREIGN KEY (case_id) REFERENCES public.cases(id) not valid;

alter table "public"."form_usage" validate constraint "form_usage_case_id_fkey";

alter table "public"."form_usage" add constraint "form_usage_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.forms(id) not valid;

alter table "public"."form_usage" validate constraint "form_usage_form_id_fkey";

alter table "public"."form_usage" add constraint "form_usage_success_rating_check" CHECK (((success_rating >= 1) AND (success_rating <= 5))) not valid;

alter table "public"."form_usage" validate constraint "form_usage_success_rating_check";

alter table "public"."forms" add constraint "forms_form_code_key" UNIQUE using index "forms_form_code_key";

alter table "public"."leads" add constraint "leads_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."leads" validate constraint "leads_user_id_fkey";

alter table "public"."legal_pathways" add constraint "legal_pathways_case_id_fkey" FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE not valid;

alter table "public"."legal_pathways" validate constraint "legal_pathways_case_id_fkey";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

alter table "public"."orders" add constraint "orders_price_id_fkey" FOREIGN KEY (price_id) REFERENCES public.prices(id) ON DELETE SET NULL not valid;

alter table "public"."orders" validate constraint "orders_price_id_fkey";

alter table "public"."orders" add constraint "orders_stripe_checkout_session_id_key" UNIQUE using index "orders_stripe_checkout_session_id_key";

alter table "public"."orders" add constraint "orders_stripe_checkout_session_id_unique" UNIQUE using index "orders_stripe_checkout_session_id_unique";

alter table "public"."orders" add constraint "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."orders" validate constraint "orders_user_id_fkey";

alter table "public"."payments" add constraint "payments_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.forms(id) not valid;

alter table "public"."payments" validate constraint "payments_form_id_fkey";

alter table "public"."payments" add constraint "payments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."payments" validate constraint "payments_user_id_fkey";

alter table "public"."plan_features" add constraint "plan_features_feature_key_fkey" FOREIGN KEY (feature_key) REFERENCES public.features(key) ON DELETE CASCADE not valid;

alter table "public"."plan_features" validate constraint "plan_features_feature_key_fkey";

alter table "public"."plan_features" add constraint "plan_features_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."plan_features" validate constraint "plan_features_product_id_fkey";

alter table "public"."prices" add constraint "prices_interval_check" CHECK ((("interval" IS NULL) OR ("interval" = ANY (ARRAY['month'::text, 'year'::text])))) not valid;

alter table "public"."prices" validate constraint "prices_interval_check";

alter table "public"."prices" add constraint "prices_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."prices" validate constraint "prices_product_id_fkey";

alter table "public"."prices" add constraint "prices_stripe_price_id_key" UNIQUE using index "prices_stripe_price_id_key";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_user_id_key" UNIQUE using index "profiles_user_id_key";

alter table "public"."programs" add constraint "programs_slug_key" UNIQUE using index "programs_slug_key";

alter table "public"."referral_codes" add constraint "referral_codes_code_key" UNIQUE using index "referral_codes_code_key";

alter table "public"."referral_codes" add constraint "referral_codes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."referral_codes" validate constraint "referral_codes_user_id_fkey";

alter table "public"."referrals" add constraint "referrals_referral_code_id_fkey" FOREIGN KEY (referral_code_id) REFERENCES public.referral_codes(id) not valid;

alter table "public"."referrals" validate constraint "referrals_referral_code_id_fkey";

alter table "public"."referrals" add constraint "referrals_referred_id_fkey" FOREIGN KEY (referred_id) REFERENCES auth.users(id) not valid;

alter table "public"."referrals" validate constraint "referrals_referred_id_fkey";

alter table "public"."referrals" add constraint "referrals_referrer_id_fkey" FOREIGN KEY (referrer_id) REFERENCES auth.users(id) not valid;

alter table "public"."referrals" validate constraint "referrals_referrer_id_fkey";

alter table "public"."saved_documents" add constraint "saved_documents_case_id_fkey" FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE SET NULL not valid;

alter table "public"."saved_documents" validate constraint "saved_documents_case_id_fkey";

alter table "public"."saved_documents" add constraint "saved_documents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."saved_documents" validate constraint "saved_documents_user_id_fkey";

alter table "public"."stripe_customers" add constraint "stripe_customers_stripe_customer_id_key" UNIQUE using index "stripe_customers_stripe_customer_id_key";

alter table "public"."stripe_customers" add constraint "stripe_customers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."stripe_customers" validate constraint "stripe_customers_user_id_fkey";

alter table "public"."stripe_webhook_events" add constraint "stripe_webhook_events_event_id_unique" UNIQUE using index "stripe_webhook_events_event_id_unique";

alter table "public"."stripe_webhook_events" add constraint "stripe_webhook_events_stripe_event_id_key" UNIQUE using index "stripe_webhook_events_stripe_event_id_key";

alter table "public"."support_messages" add constraint "support_messages_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id) ON DELETE CASCADE not valid;

alter table "public"."support_messages" validate constraint "support_messages_ticket_id_fkey";

alter table "public"."support_messages" add constraint "support_messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."support_messages" validate constraint "support_messages_user_id_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_user_id_fkey";

alter table "public"."testimonials" add constraint "testimonials_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."testimonials" validate constraint "testimonials_user_id_fkey";

alter table "public"."timeline_events" add constraint "timeline_events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."timeline_events" validate constraint "timeline_events_user_id_fkey";

alter table "public"."user_credits" add constraint "user_credits_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."user_credits" validate constraint "user_credits_user_id_fkey";

alter table "public"."user_credits" add constraint "user_credits_user_id_key" UNIQUE using index "user_credits_user_id_key";

alter table "public"."user_feedback" add constraint "user_feedback_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."user_feedback" validate constraint "user_feedback_user_id_fkey";

alter table "public"."user_preferences" add constraint "user_preferences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."user_preferences" validate constraint "user_preferences_user_id_fkey";

alter table "public"."user_preferences" add constraint "user_preferences_user_id_key" UNIQUE using index "user_preferences_user_id_key";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_role_key" UNIQUE using index "user_roles_user_id_role_key";

set check_function_bodies = off;

create or replace view "public"."active_entitlements" as  SELECT user_id,
    product_id,
    access_level,
    source,
    starts_at,
    ends_at,
    ((ends_at IS NULL) OR (ends_at > now())) AS is_active
   FROM public.entitlements;


CREATE OR REPLACE FUNCTION public.check_free_tier_eligibility(p_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.entitlements e
    WHERE e.user_id = p_user_id
    AND (e.ends_at IS NULL OR e.ends_at > now())
  );
$function$
;

CREATE OR REPLACE FUNCTION public.db_ping()
 RETURNS json
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  select json_build_object(
    'ok', true,
    'time', now()
  );
$function$
;

CREATE OR REPLACE FUNCTION public.evidence_tsvector_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  new.content_tsvector := to_tsvector('english', coalesce(new.title,'') || ' ' || coalesce(new.content,''));
  return new;
end
$function$
;

CREATE OR REPLACE FUNCTION public.exec_sql_count(p_schema text, p_table text)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  result bigint;
begin
  execute format('select count(1) from %I.%I', p_schema, p_table) into result;
  return coalesce(result, 0);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.export_program_summary(p_program_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  RETURN jsonb_build_object(
    'program_id', p_program_id,
    'summary', '{}'::jsonb
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_all_admins()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  RETURN (
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', ur.user_id,
        'role', ur.role,
        'created_at', ur.created_at
      )
    ), '[]'::jsonb)
    FROM public.user_roles ur
    WHERE ur.role = 'admin'
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_all_users_admin()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb;
BEGIN
  -- Check if caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', u.id,
      'email', u.email,
      'created_at', u.created_at,
      'last_sign_in_at', u.last_sign_in_at
    )
  ) INTO result
  FROM auth.users u
  LIMIT 100;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_program_stats(p_program_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  RETURN jsonb_build_object(
    'program_id', p_program_id,
    'stats', '{}'::jsonb
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.grant_admin_role(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, display_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'first_name')
  );
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.has_active_entitlement(p_product_id text)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select exists (
    select 1
    from public.entitlements e
    where e.user_id = (select auth.uid())
      and e.product_id = p_product_id
      and (e.ends_at is null or e.ends_at > now())
  );
$function$
;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$
;

CREATE OR REPLACE FUNCTION public.increment_form_usage(form_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.forms
  SET usage_count = usage_count + 1
  WHERE id = form_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_program_referral(p_program_slug text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.programs
  SET referral_count = COALESCE(referral_count, 0) + 1
  WHERE slug = p_program_slug;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.make_user_admin(_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    _user_id uuid;
BEGIN
    -- Find user by email
    SELECT id INTO _user_id
    FROM auth.users
    WHERE email = _email;
    
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', _email;
    END IF;
    
    -- Insert admin role (or update if exists)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$function$
;

create or replace view "public"."my_active_entitlements" as  SELECT product_id,
    access_level,
    source,
    starts_at,
    ends_at
   FROM public.entitlements
  WHERE ((user_id = ( SELECT auth.uid() AS uid)) AND ((ends_at IS NULL) OR (ends_at > now())));


CREATE OR REPLACE FUNCTION public.revoke_admin_role(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  DELETE FROM public.user_roles
  WHERE user_id = p_user_id AND role = 'admin';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.user_feature_number(p_feature_key text, p_path text[])
 RETURNS numeric
 LANGUAGE sql
 STABLE
AS $function$
  with active_entitlements as (
    select e.product_id
    from public.entitlements e
    where e.user_id = auth.uid()
      and (e.ends_at is null or e.ends_at > now())
  ),
  feature_values as (
    select pf.value
    from public.plan_features pf
    join active_entitlements ae on ae.product_id = pf.product_id
    where pf.feature_key = p_feature_key
  ),
  unlimited as (
    select 1 as flag
    from feature_values
    where value ? 'unlimited'
    limit 1
  ),
  numeric_vals as (
    select nullif((value #>> p_path), '')::numeric as num
    from feature_values
  )
  select case
    when exists (select 1 from unlimited) then null
    else (select max(num) from numeric_vals)
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.user_feature_unlimited(p_feature_key text)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select (public.user_feature_value(p_feature_key) ? 'unlimited');
$function$
;

CREATE OR REPLACE FUNCTION public.user_feature_value(p_feature_key text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  -- priority: all_access -> first matching plan feature
  with active_entitlements as (
    select e.product_id
    from public.entitlements e
    where e.user_id = auth.uid()
      and (e.ends_at is null or e.ends_at > now())
  )
  select coalesce(
    -- if all_access, return object indicating unlimited
    case when exists (select 1 from active_entitlements where product_id = 'all_access')
      then jsonb_build_object('unlimited', true)
    end,
    -- else return the first matching value for the feature across active entitlements
    (
      select pf.value
      from public.plan_features pf
      join active_entitlements ae on ae.product_id = pf.product_id
      where pf.feature_key = p_feature_key
      order by pf.product_id
      limit 1
    )
  );
$function$
;

CREATE OR REPLACE FUNCTION public.user_has_feature(p_feature_key text)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select
    -- all access shortcut
    exists (
      select 1
      from public.entitlements e
      where e.user_id = auth.uid()
        and e.product_id = 'all_access'
        and (e.ends_at is null or e.ends_at > now())
    )
    or
    -- plan-specific feature
    exists (
      select 1
      from public.entitlements e
      join public.plan_features pf on pf.product_id = e.product_id
      where e.user_id = auth.uid()
        and pf.feature_key = p_feature_key
        and (e.ends_at is null or e.ends_at > now())
    );
$function$
;

grant delete on table "public"."analytics_events" to "anon";

grant insert on table "public"."analytics_events" to "anon";

grant references on table "public"."analytics_events" to "anon";

grant select on table "public"."analytics_events" to "anon";

grant trigger on table "public"."analytics_events" to "anon";

grant truncate on table "public"."analytics_events" to "anon";

grant update on table "public"."analytics_events" to "anon";

grant delete on table "public"."analytics_events" to "authenticated";

grant insert on table "public"."analytics_events" to "authenticated";

grant references on table "public"."analytics_events" to "authenticated";

grant select on table "public"."analytics_events" to "authenticated";

grant trigger on table "public"."analytics_events" to "authenticated";

grant truncate on table "public"."analytics_events" to "authenticated";

grant update on table "public"."analytics_events" to "authenticated";

grant delete on table "public"."analytics_events" to "service_role";

grant insert on table "public"."analytics_events" to "service_role";

grant references on table "public"."analytics_events" to "service_role";

grant select on table "public"."analytics_events" to "service_role";

grant trigger on table "public"."analytics_events" to "service_role";

grant truncate on table "public"."analytics_events" to "service_role";

grant update on table "public"."analytics_events" to "service_role";

grant delete on table "public"."case_deadlines" to "anon";

grant insert on table "public"."case_deadlines" to "anon";

grant references on table "public"."case_deadlines" to "anon";

grant select on table "public"."case_deadlines" to "anon";

grant trigger on table "public"."case_deadlines" to "anon";

grant truncate on table "public"."case_deadlines" to "anon";

grant update on table "public"."case_deadlines" to "anon";

grant delete on table "public"."case_deadlines" to "authenticated";

grant insert on table "public"."case_deadlines" to "authenticated";

grant references on table "public"."case_deadlines" to "authenticated";

grant select on table "public"."case_deadlines" to "authenticated";

grant trigger on table "public"."case_deadlines" to "authenticated";

grant truncate on table "public"."case_deadlines" to "authenticated";

grant update on table "public"."case_deadlines" to "authenticated";

grant delete on table "public"."case_deadlines" to "service_role";

grant insert on table "public"."case_deadlines" to "service_role";

grant references on table "public"."case_deadlines" to "service_role";

grant select on table "public"."case_deadlines" to "service_role";

grant trigger on table "public"."case_deadlines" to "service_role";

grant truncate on table "public"."case_deadlines" to "service_role";

grant update on table "public"."case_deadlines" to "service_role";

grant delete on table "public"."case_events" to "anon";

grant insert on table "public"."case_events" to "anon";

grant references on table "public"."case_events" to "anon";

grant select on table "public"."case_events" to "anon";

grant trigger on table "public"."case_events" to "anon";

grant truncate on table "public"."case_events" to "anon";

grant update on table "public"."case_events" to "anon";

grant delete on table "public"."case_events" to "authenticated";

grant insert on table "public"."case_events" to "authenticated";

grant references on table "public"."case_events" to "authenticated";

grant select on table "public"."case_events" to "authenticated";

grant trigger on table "public"."case_events" to "authenticated";

grant truncate on table "public"."case_events" to "authenticated";

grant update on table "public"."case_events" to "authenticated";

grant delete on table "public"."case_events" to "service_role";

grant insert on table "public"."case_events" to "service_role";

grant references on table "public"."case_events" to "service_role";

grant select on table "public"."case_events" to "service_role";

grant trigger on table "public"."case_events" to "service_role";

grant truncate on table "public"."case_events" to "service_role";

grant update on table "public"."case_events" to "service_role";

grant delete on table "public"."case_milestones" to "anon";

grant insert on table "public"."case_milestones" to "anon";

grant references on table "public"."case_milestones" to "anon";

grant select on table "public"."case_milestones" to "anon";

grant trigger on table "public"."case_milestones" to "anon";

grant truncate on table "public"."case_milestones" to "anon";

grant update on table "public"."case_milestones" to "anon";

grant delete on table "public"."case_milestones" to "authenticated";

grant insert on table "public"."case_milestones" to "authenticated";

grant references on table "public"."case_milestones" to "authenticated";

grant select on table "public"."case_milestones" to "authenticated";

grant trigger on table "public"."case_milestones" to "authenticated";

grant truncate on table "public"."case_milestones" to "authenticated";

grant update on table "public"."case_milestones" to "authenticated";

grant delete on table "public"."case_milestones" to "service_role";

grant insert on table "public"."case_milestones" to "service_role";

grant references on table "public"."case_milestones" to "service_role";

grant select on table "public"."case_milestones" to "service_role";

grant trigger on table "public"."case_milestones" to "service_role";

grant truncate on table "public"."case_milestones" to "service_role";

grant update on table "public"."case_milestones" to "service_role";

grant delete on table "public"."cases" to "anon";

grant insert on table "public"."cases" to "anon";

grant references on table "public"."cases" to "anon";

grant select on table "public"."cases" to "anon";

grant trigger on table "public"."cases" to "anon";

grant truncate on table "public"."cases" to "anon";

grant update on table "public"."cases" to "anon";

grant delete on table "public"."cases" to "authenticated";

grant insert on table "public"."cases" to "authenticated";

grant references on table "public"."cases" to "authenticated";

grant select on table "public"."cases" to "authenticated";

grant trigger on table "public"."cases" to "authenticated";

grant truncate on table "public"."cases" to "authenticated";

grant update on table "public"."cases" to "authenticated";

grant delete on table "public"."cases" to "service_role";

grant insert on table "public"."cases" to "service_role";

grant references on table "public"."cases" to "service_role";

grant select on table "public"."cases" to "service_role";

grant trigger on table "public"."cases" to "service_role";

grant truncate on table "public"."cases" to "service_role";

grant update on table "public"."cases" to "service_role";

grant delete on table "public"."document_templates" to "anon";

grant insert on table "public"."document_templates" to "anon";

grant references on table "public"."document_templates" to "anon";

grant select on table "public"."document_templates" to "anon";

grant trigger on table "public"."document_templates" to "anon";

grant truncate on table "public"."document_templates" to "anon";

grant update on table "public"."document_templates" to "anon";

grant delete on table "public"."document_templates" to "authenticated";

grant insert on table "public"."document_templates" to "authenticated";

grant references on table "public"."document_templates" to "authenticated";

grant select on table "public"."document_templates" to "authenticated";

grant trigger on table "public"."document_templates" to "authenticated";

grant truncate on table "public"."document_templates" to "authenticated";

grant update on table "public"."document_templates" to "authenticated";

grant delete on table "public"."document_templates" to "service_role";

grant insert on table "public"."document_templates" to "service_role";

grant references on table "public"."document_templates" to "service_role";

grant select on table "public"."document_templates" to "service_role";

grant trigger on table "public"."document_templates" to "service_role";

grant truncate on table "public"."document_templates" to "service_role";

grant update on table "public"."document_templates" to "service_role";

grant delete on table "public"."documents" to "anon";

grant insert on table "public"."documents" to "anon";

grant references on table "public"."documents" to "anon";

grant select on table "public"."documents" to "anon";

grant trigger on table "public"."documents" to "anon";

grant truncate on table "public"."documents" to "anon";

grant update on table "public"."documents" to "anon";

grant delete on table "public"."documents" to "authenticated";

grant insert on table "public"."documents" to "authenticated";

grant references on table "public"."documents" to "authenticated";

grant select on table "public"."documents" to "authenticated";

grant trigger on table "public"."documents" to "authenticated";

grant truncate on table "public"."documents" to "authenticated";

grant update on table "public"."documents" to "authenticated";

grant delete on table "public"."documents" to "service_role";

grant insert on table "public"."documents" to "service_role";

grant references on table "public"."documents" to "service_role";

grant select on table "public"."documents" to "service_role";

grant trigger on table "public"."documents" to "service_role";

grant truncate on table "public"."documents" to "service_role";

grant update on table "public"."documents" to "service_role";

grant select on table "public"."entitlements" to "authenticated";

grant delete on table "public"."entitlements" to "service_role";

grant insert on table "public"."entitlements" to "service_role";

grant references on table "public"."entitlements" to "service_role";

grant select on table "public"."entitlements" to "service_role";

grant trigger on table "public"."entitlements" to "service_role";

grant truncate on table "public"."entitlements" to "service_role";

grant update on table "public"."entitlements" to "service_role";

grant delete on table "public"."evidence" to "anon";

grant insert on table "public"."evidence" to "anon";

grant references on table "public"."evidence" to "anon";

grant select on table "public"."evidence" to "anon";

grant trigger on table "public"."evidence" to "anon";

grant truncate on table "public"."evidence" to "anon";

grant update on table "public"."evidence" to "anon";

grant delete on table "public"."evidence" to "authenticated";

grant insert on table "public"."evidence" to "authenticated";

grant references on table "public"."evidence" to "authenticated";

grant select on table "public"."evidence" to "authenticated";

grant trigger on table "public"."evidence" to "authenticated";

grant truncate on table "public"."evidence" to "authenticated";

grant update on table "public"."evidence" to "authenticated";

grant delete on table "public"."evidence" to "service_role";

grant insert on table "public"."evidence" to "service_role";

grant references on table "public"."evidence" to "service_role";

grant select on table "public"."evidence" to "service_role";

grant trigger on table "public"."evidence" to "service_role";

grant truncate on table "public"."evidence" to "service_role";

grant update on table "public"."evidence" to "service_role";

grant delete on table "public"."evidence_analysis" to "anon";

grant insert on table "public"."evidence_analysis" to "anon";

grant references on table "public"."evidence_analysis" to "anon";

grant select on table "public"."evidence_analysis" to "anon";

grant trigger on table "public"."evidence_analysis" to "anon";

grant truncate on table "public"."evidence_analysis" to "anon";

grant update on table "public"."evidence_analysis" to "anon";

grant delete on table "public"."evidence_analysis" to "authenticated";

grant insert on table "public"."evidence_analysis" to "authenticated";

grant references on table "public"."evidence_analysis" to "authenticated";

grant select on table "public"."evidence_analysis" to "authenticated";

grant trigger on table "public"."evidence_analysis" to "authenticated";

grant truncate on table "public"."evidence_analysis" to "authenticated";

grant update on table "public"."evidence_analysis" to "authenticated";

grant delete on table "public"."evidence_analysis" to "service_role";

grant insert on table "public"."evidence_analysis" to "service_role";

grant references on table "public"."evidence_analysis" to "service_role";

grant select on table "public"."evidence_analysis" to "service_role";

grant trigger on table "public"."evidence_analysis" to "service_role";

grant truncate on table "public"."evidence_analysis" to "service_role";

grant update on table "public"."evidence_analysis" to "service_role";

grant delete on table "public"."evidence_metadata" to "anon";

grant insert on table "public"."evidence_metadata" to "anon";

grant references on table "public"."evidence_metadata" to "anon";

grant select on table "public"."evidence_metadata" to "anon";

grant trigger on table "public"."evidence_metadata" to "anon";

grant truncate on table "public"."evidence_metadata" to "anon";

grant update on table "public"."evidence_metadata" to "anon";

grant delete on table "public"."evidence_metadata" to "authenticated";

grant insert on table "public"."evidence_metadata" to "authenticated";

grant references on table "public"."evidence_metadata" to "authenticated";

grant select on table "public"."evidence_metadata" to "authenticated";

grant trigger on table "public"."evidence_metadata" to "authenticated";

grant truncate on table "public"."evidence_metadata" to "authenticated";

grant update on table "public"."evidence_metadata" to "authenticated";

grant delete on table "public"."evidence_metadata" to "service_role";

grant insert on table "public"."evidence_metadata" to "service_role";

grant references on table "public"."evidence_metadata" to "service_role";

grant select on table "public"."evidence_metadata" to "service_role";

grant trigger on table "public"."evidence_metadata" to "service_role";

grant truncate on table "public"."evidence_metadata" to "service_role";

grant update on table "public"."evidence_metadata" to "service_role";

grant select on table "public"."features" to "anon";

grant select on table "public"."features" to "authenticated";

grant delete on table "public"."features" to "service_role";

grant insert on table "public"."features" to "service_role";

grant references on table "public"."features" to "service_role";

grant select on table "public"."features" to "service_role";

grant trigger on table "public"."features" to "service_role";

grant truncate on table "public"."features" to "service_role";

grant update on table "public"."features" to "service_role";

grant delete on table "public"."form_usage" to "anon";

grant insert on table "public"."form_usage" to "anon";

grant references on table "public"."form_usage" to "anon";

grant select on table "public"."form_usage" to "anon";

grant trigger on table "public"."form_usage" to "anon";

grant truncate on table "public"."form_usage" to "anon";

grant update on table "public"."form_usage" to "anon";

grant delete on table "public"."form_usage" to "authenticated";

grant insert on table "public"."form_usage" to "authenticated";

grant references on table "public"."form_usage" to "authenticated";

grant select on table "public"."form_usage" to "authenticated";

grant trigger on table "public"."form_usage" to "authenticated";

grant truncate on table "public"."form_usage" to "authenticated";

grant update on table "public"."form_usage" to "authenticated";

grant delete on table "public"."form_usage" to "service_role";

grant insert on table "public"."form_usage" to "service_role";

grant references on table "public"."form_usage" to "service_role";

grant select on table "public"."form_usage" to "service_role";

grant trigger on table "public"."form_usage" to "service_role";

grant truncate on table "public"."form_usage" to "service_role";

grant update on table "public"."form_usage" to "service_role";

grant delete on table "public"."forms" to "anon";

grant insert on table "public"."forms" to "anon";

grant references on table "public"."forms" to "anon";

grant select on table "public"."forms" to "anon";

grant trigger on table "public"."forms" to "anon";

grant truncate on table "public"."forms" to "anon";

grant update on table "public"."forms" to "anon";

grant delete on table "public"."forms" to "authenticated";

grant insert on table "public"."forms" to "authenticated";

grant references on table "public"."forms" to "authenticated";

grant select on table "public"."forms" to "authenticated";

grant trigger on table "public"."forms" to "authenticated";

grant truncate on table "public"."forms" to "authenticated";

grant update on table "public"."forms" to "authenticated";

grant delete on table "public"."forms" to "service_role";

grant insert on table "public"."forms" to "service_role";

grant references on table "public"."forms" to "service_role";

grant select on table "public"."forms" to "service_role";

grant trigger on table "public"."forms" to "service_role";

grant truncate on table "public"."forms" to "service_role";

grant update on table "public"."forms" to "service_role";

grant delete on table "public"."healthcheck" to "anon";

grant insert on table "public"."healthcheck" to "anon";

grant references on table "public"."healthcheck" to "anon";

grant select on table "public"."healthcheck" to "anon";

grant trigger on table "public"."healthcheck" to "anon";

grant truncate on table "public"."healthcheck" to "anon";

grant update on table "public"."healthcheck" to "anon";

grant delete on table "public"."healthcheck" to "authenticated";

grant insert on table "public"."healthcheck" to "authenticated";

grant references on table "public"."healthcheck" to "authenticated";

grant select on table "public"."healthcheck" to "authenticated";

grant trigger on table "public"."healthcheck" to "authenticated";

grant truncate on table "public"."healthcheck" to "authenticated";

grant update on table "public"."healthcheck" to "authenticated";

grant delete on table "public"."healthcheck" to "service_role";

grant insert on table "public"."healthcheck" to "service_role";

grant references on table "public"."healthcheck" to "service_role";

grant select on table "public"."healthcheck" to "service_role";

grant trigger on table "public"."healthcheck" to "service_role";

grant truncate on table "public"."healthcheck" to "service_role";

grant update on table "public"."healthcheck" to "service_role";

grant delete on table "public"."leads" to "anon";

grant insert on table "public"."leads" to "anon";

grant references on table "public"."leads" to "anon";

grant select on table "public"."leads" to "anon";

grant trigger on table "public"."leads" to "anon";

grant truncate on table "public"."leads" to "anon";

grant update on table "public"."leads" to "anon";

grant delete on table "public"."leads" to "authenticated";

grant insert on table "public"."leads" to "authenticated";

grant references on table "public"."leads" to "authenticated";

grant select on table "public"."leads" to "authenticated";

grant trigger on table "public"."leads" to "authenticated";

grant truncate on table "public"."leads" to "authenticated";

grant update on table "public"."leads" to "authenticated";

grant delete on table "public"."leads" to "service_role";

grant insert on table "public"."leads" to "service_role";

grant references on table "public"."leads" to "service_role";

grant select on table "public"."leads" to "service_role";

grant trigger on table "public"."leads" to "service_role";

grant truncate on table "public"."leads" to "service_role";

grant update on table "public"."leads" to "service_role";

grant delete on table "public"."legal_pathways" to "anon";

grant insert on table "public"."legal_pathways" to "anon";

grant references on table "public"."legal_pathways" to "anon";

grant select on table "public"."legal_pathways" to "anon";

grant trigger on table "public"."legal_pathways" to "anon";

grant truncate on table "public"."legal_pathways" to "anon";

grant update on table "public"."legal_pathways" to "anon";

grant delete on table "public"."legal_pathways" to "authenticated";

grant insert on table "public"."legal_pathways" to "authenticated";

grant references on table "public"."legal_pathways" to "authenticated";

grant select on table "public"."legal_pathways" to "authenticated";

grant trigger on table "public"."legal_pathways" to "authenticated";

grant truncate on table "public"."legal_pathways" to "authenticated";

grant update on table "public"."legal_pathways" to "authenticated";

grant delete on table "public"."legal_pathways" to "service_role";

grant insert on table "public"."legal_pathways" to "service_role";

grant references on table "public"."legal_pathways" to "service_role";

grant select on table "public"."legal_pathways" to "service_role";

grant trigger on table "public"."legal_pathways" to "service_role";

grant truncate on table "public"."legal_pathways" to "service_role";

grant update on table "public"."legal_pathways" to "service_role";

grant delete on table "public"."low_income_applications" to "anon";

grant insert on table "public"."low_income_applications" to "anon";

grant references on table "public"."low_income_applications" to "anon";

grant select on table "public"."low_income_applications" to "anon";

grant trigger on table "public"."low_income_applications" to "anon";

grant truncate on table "public"."low_income_applications" to "anon";

grant update on table "public"."low_income_applications" to "anon";

grant delete on table "public"."low_income_applications" to "authenticated";

grant insert on table "public"."low_income_applications" to "authenticated";

grant references on table "public"."low_income_applications" to "authenticated";

grant select on table "public"."low_income_applications" to "authenticated";

grant trigger on table "public"."low_income_applications" to "authenticated";

grant truncate on table "public"."low_income_applications" to "authenticated";

grant update on table "public"."low_income_applications" to "authenticated";

grant delete on table "public"."low_income_applications" to "service_role";

grant insert on table "public"."low_income_applications" to "service_role";

grant references on table "public"."low_income_applications" to "service_role";

grant select on table "public"."low_income_applications" to "service_role";

grant trigger on table "public"."low_income_applications" to "service_role";

grant truncate on table "public"."low_income_applications" to "service_role";

grant update on table "public"."low_income_applications" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant select on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."payments" to "anon";

grant insert on table "public"."payments" to "anon";

grant references on table "public"."payments" to "anon";

grant select on table "public"."payments" to "anon";

grant trigger on table "public"."payments" to "anon";

grant truncate on table "public"."payments" to "anon";

grant update on table "public"."payments" to "anon";

grant delete on table "public"."payments" to "authenticated";

grant insert on table "public"."payments" to "authenticated";

grant references on table "public"."payments" to "authenticated";

grant select on table "public"."payments" to "authenticated";

grant trigger on table "public"."payments" to "authenticated";

grant truncate on table "public"."payments" to "authenticated";

grant update on table "public"."payments" to "authenticated";

grant delete on table "public"."payments" to "service_role";

grant insert on table "public"."payments" to "service_role";

grant references on table "public"."payments" to "service_role";

grant select on table "public"."payments" to "service_role";

grant trigger on table "public"."payments" to "service_role";

grant truncate on table "public"."payments" to "service_role";

grant update on table "public"."payments" to "service_role";

grant select on table "public"."plan_features" to "anon";

grant select on table "public"."plan_features" to "authenticated";

grant delete on table "public"."plan_features" to "service_role";

grant insert on table "public"."plan_features" to "service_role";

grant references on table "public"."plan_features" to "service_role";

grant select on table "public"."plan_features" to "service_role";

grant trigger on table "public"."plan_features" to "service_role";

grant truncate on table "public"."plan_features" to "service_role";

grant update on table "public"."plan_features" to "service_role";

grant select on table "public"."prices" to "anon";

grant select on table "public"."prices" to "authenticated";

grant delete on table "public"."prices" to "service_role";

grant insert on table "public"."prices" to "service_role";

grant references on table "public"."prices" to "service_role";

grant select on table "public"."prices" to "service_role";

grant trigger on table "public"."prices" to "service_role";

grant truncate on table "public"."prices" to "service_role";

grant update on table "public"."prices" to "service_role";

grant select on table "public"."products" to "anon";

grant select on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."programs" to "anon";

grant insert on table "public"."programs" to "anon";

grant references on table "public"."programs" to "anon";

grant select on table "public"."programs" to "anon";

grant trigger on table "public"."programs" to "anon";

grant truncate on table "public"."programs" to "anon";

grant update on table "public"."programs" to "anon";

grant delete on table "public"."programs" to "authenticated";

grant insert on table "public"."programs" to "authenticated";

grant references on table "public"."programs" to "authenticated";

grant select on table "public"."programs" to "authenticated";

grant trigger on table "public"."programs" to "authenticated";

grant truncate on table "public"."programs" to "authenticated";

grant update on table "public"."programs" to "authenticated";

grant delete on table "public"."programs" to "service_role";

grant insert on table "public"."programs" to "service_role";

grant references on table "public"."programs" to "service_role";

grant select on table "public"."programs" to "service_role";

grant trigger on table "public"."programs" to "service_role";

grant truncate on table "public"."programs" to "service_role";

grant update on table "public"."programs" to "service_role";

grant delete on table "public"."referral_codes" to "anon";

grant insert on table "public"."referral_codes" to "anon";

grant references on table "public"."referral_codes" to "anon";

grant select on table "public"."referral_codes" to "anon";

grant trigger on table "public"."referral_codes" to "anon";

grant truncate on table "public"."referral_codes" to "anon";

grant update on table "public"."referral_codes" to "anon";

grant delete on table "public"."referral_codes" to "authenticated";

grant insert on table "public"."referral_codes" to "authenticated";

grant references on table "public"."referral_codes" to "authenticated";

grant select on table "public"."referral_codes" to "authenticated";

grant trigger on table "public"."referral_codes" to "authenticated";

grant truncate on table "public"."referral_codes" to "authenticated";

grant update on table "public"."referral_codes" to "authenticated";

grant delete on table "public"."referral_codes" to "service_role";

grant insert on table "public"."referral_codes" to "service_role";

grant references on table "public"."referral_codes" to "service_role";

grant select on table "public"."referral_codes" to "service_role";

grant trigger on table "public"."referral_codes" to "service_role";

grant truncate on table "public"."referral_codes" to "service_role";

grant update on table "public"."referral_codes" to "service_role";

grant delete on table "public"."referrals" to "anon";

grant insert on table "public"."referrals" to "anon";

grant references on table "public"."referrals" to "anon";

grant select on table "public"."referrals" to "anon";

grant trigger on table "public"."referrals" to "anon";

grant truncate on table "public"."referrals" to "anon";

grant update on table "public"."referrals" to "anon";

grant delete on table "public"."referrals" to "authenticated";

grant insert on table "public"."referrals" to "authenticated";

grant references on table "public"."referrals" to "authenticated";

grant select on table "public"."referrals" to "authenticated";

grant trigger on table "public"."referrals" to "authenticated";

grant truncate on table "public"."referrals" to "authenticated";

grant update on table "public"."referrals" to "authenticated";

grant delete on table "public"."referrals" to "service_role";

grant insert on table "public"."referrals" to "service_role";

grant references on table "public"."referrals" to "service_role";

grant select on table "public"."referrals" to "service_role";

grant trigger on table "public"."referrals" to "service_role";

grant truncate on table "public"."referrals" to "service_role";

grant update on table "public"."referrals" to "service_role";

grant delete on table "public"."saved_documents" to "anon";

grant insert on table "public"."saved_documents" to "anon";

grant references on table "public"."saved_documents" to "anon";

grant select on table "public"."saved_documents" to "anon";

grant trigger on table "public"."saved_documents" to "anon";

grant truncate on table "public"."saved_documents" to "anon";

grant update on table "public"."saved_documents" to "anon";

grant delete on table "public"."saved_documents" to "authenticated";

grant insert on table "public"."saved_documents" to "authenticated";

grant references on table "public"."saved_documents" to "authenticated";

grant select on table "public"."saved_documents" to "authenticated";

grant trigger on table "public"."saved_documents" to "authenticated";

grant truncate on table "public"."saved_documents" to "authenticated";

grant update on table "public"."saved_documents" to "authenticated";

grant delete on table "public"."saved_documents" to "service_role";

grant insert on table "public"."saved_documents" to "service_role";

grant references on table "public"."saved_documents" to "service_role";

grant select on table "public"."saved_documents" to "service_role";

grant trigger on table "public"."saved_documents" to "service_role";

grant truncate on table "public"."saved_documents" to "service_role";

grant update on table "public"."saved_documents" to "service_role";

grant select on table "public"."stripe_customers" to "authenticated";

grant delete on table "public"."stripe_customers" to "service_role";

grant insert on table "public"."stripe_customers" to "service_role";

grant references on table "public"."stripe_customers" to "service_role";

grant select on table "public"."stripe_customers" to "service_role";

grant trigger on table "public"."stripe_customers" to "service_role";

grant truncate on table "public"."stripe_customers" to "service_role";

grant update on table "public"."stripe_customers" to "service_role";

grant select on table "public"."stripe_webhook_events" to "authenticated";

grant delete on table "public"."stripe_webhook_events" to "service_role";

grant insert on table "public"."stripe_webhook_events" to "service_role";

grant references on table "public"."stripe_webhook_events" to "service_role";

grant select on table "public"."stripe_webhook_events" to "service_role";

grant trigger on table "public"."stripe_webhook_events" to "service_role";

grant truncate on table "public"."stripe_webhook_events" to "service_role";

grant update on table "public"."stripe_webhook_events" to "service_role";

grant delete on table "public"."support_messages" to "anon";

grant insert on table "public"."support_messages" to "anon";

grant references on table "public"."support_messages" to "anon";

grant select on table "public"."support_messages" to "anon";

grant trigger on table "public"."support_messages" to "anon";

grant truncate on table "public"."support_messages" to "anon";

grant update on table "public"."support_messages" to "anon";

grant delete on table "public"."support_messages" to "authenticated";

grant insert on table "public"."support_messages" to "authenticated";

grant references on table "public"."support_messages" to "authenticated";

grant select on table "public"."support_messages" to "authenticated";

grant trigger on table "public"."support_messages" to "authenticated";

grant truncate on table "public"."support_messages" to "authenticated";

grant update on table "public"."support_messages" to "authenticated";

grant delete on table "public"."support_messages" to "service_role";

grant insert on table "public"."support_messages" to "service_role";

grant references on table "public"."support_messages" to "service_role";

grant select on table "public"."support_messages" to "service_role";

grant trigger on table "public"."support_messages" to "service_role";

grant truncate on table "public"."support_messages" to "service_role";

grant update on table "public"."support_messages" to "service_role";

grant delete on table "public"."support_tickets" to "anon";

grant insert on table "public"."support_tickets" to "anon";

grant references on table "public"."support_tickets" to "anon";

grant select on table "public"."support_tickets" to "anon";

grant trigger on table "public"."support_tickets" to "anon";

grant truncate on table "public"."support_tickets" to "anon";

grant update on table "public"."support_tickets" to "anon";

grant delete on table "public"."support_tickets" to "authenticated";

grant insert on table "public"."support_tickets" to "authenticated";

grant references on table "public"."support_tickets" to "authenticated";

grant select on table "public"."support_tickets" to "authenticated";

grant trigger on table "public"."support_tickets" to "authenticated";

grant truncate on table "public"."support_tickets" to "authenticated";

grant update on table "public"."support_tickets" to "authenticated";

grant delete on table "public"."support_tickets" to "service_role";

grant insert on table "public"."support_tickets" to "service_role";

grant references on table "public"."support_tickets" to "service_role";

grant select on table "public"."support_tickets" to "service_role";

grant trigger on table "public"."support_tickets" to "service_role";

grant truncate on table "public"."support_tickets" to "service_role";

grant update on table "public"."support_tickets" to "service_role";

grant delete on table "public"."testimonials" to "anon";

grant insert on table "public"."testimonials" to "anon";

grant references on table "public"."testimonials" to "anon";

grant select on table "public"."testimonials" to "anon";

grant trigger on table "public"."testimonials" to "anon";

grant truncate on table "public"."testimonials" to "anon";

grant update on table "public"."testimonials" to "anon";

grant delete on table "public"."testimonials" to "authenticated";

grant insert on table "public"."testimonials" to "authenticated";

grant references on table "public"."testimonials" to "authenticated";

grant select on table "public"."testimonials" to "authenticated";

grant trigger on table "public"."testimonials" to "authenticated";

grant truncate on table "public"."testimonials" to "authenticated";

grant update on table "public"."testimonials" to "authenticated";

grant delete on table "public"."testimonials" to "service_role";

grant insert on table "public"."testimonials" to "service_role";

grant references on table "public"."testimonials" to "service_role";

grant select on table "public"."testimonials" to "service_role";

grant trigger on table "public"."testimonials" to "service_role";

grant truncate on table "public"."testimonials" to "service_role";

grant update on table "public"."testimonials" to "service_role";

grant delete on table "public"."timeline_events" to "anon";

grant insert on table "public"."timeline_events" to "anon";

grant references on table "public"."timeline_events" to "anon";

grant select on table "public"."timeline_events" to "anon";

grant trigger on table "public"."timeline_events" to "anon";

grant truncate on table "public"."timeline_events" to "anon";

grant update on table "public"."timeline_events" to "anon";

grant delete on table "public"."timeline_events" to "authenticated";

grant insert on table "public"."timeline_events" to "authenticated";

grant references on table "public"."timeline_events" to "authenticated";

grant select on table "public"."timeline_events" to "authenticated";

grant trigger on table "public"."timeline_events" to "authenticated";

grant truncate on table "public"."timeline_events" to "authenticated";

grant update on table "public"."timeline_events" to "authenticated";

grant delete on table "public"."timeline_events" to "service_role";

grant insert on table "public"."timeline_events" to "service_role";

grant references on table "public"."timeline_events" to "service_role";

grant select on table "public"."timeline_events" to "service_role";

grant trigger on table "public"."timeline_events" to "service_role";

grant truncate on table "public"."timeline_events" to "service_role";

grant update on table "public"."timeline_events" to "service_role";

grant delete on table "public"."tutorial_videos" to "anon";

grant insert on table "public"."tutorial_videos" to "anon";

grant references on table "public"."tutorial_videos" to "anon";

grant select on table "public"."tutorial_videos" to "anon";

grant trigger on table "public"."tutorial_videos" to "anon";

grant truncate on table "public"."tutorial_videos" to "anon";

grant update on table "public"."tutorial_videos" to "anon";

grant delete on table "public"."tutorial_videos" to "authenticated";

grant insert on table "public"."tutorial_videos" to "authenticated";

grant references on table "public"."tutorial_videos" to "authenticated";

grant select on table "public"."tutorial_videos" to "authenticated";

grant trigger on table "public"."tutorial_videos" to "authenticated";

grant truncate on table "public"."tutorial_videos" to "authenticated";

grant update on table "public"."tutorial_videos" to "authenticated";

grant delete on table "public"."tutorial_videos" to "service_role";

grant insert on table "public"."tutorial_videos" to "service_role";

grant references on table "public"."tutorial_videos" to "service_role";

grant select on table "public"."tutorial_videos" to "service_role";

grant trigger on table "public"."tutorial_videos" to "service_role";

grant truncate on table "public"."tutorial_videos" to "service_role";

grant update on table "public"."tutorial_videos" to "service_role";

grant delete on table "public"."user_credits" to "anon";

grant insert on table "public"."user_credits" to "anon";

grant references on table "public"."user_credits" to "anon";

grant select on table "public"."user_credits" to "anon";

grant trigger on table "public"."user_credits" to "anon";

grant truncate on table "public"."user_credits" to "anon";

grant update on table "public"."user_credits" to "anon";

grant delete on table "public"."user_credits" to "authenticated";

grant insert on table "public"."user_credits" to "authenticated";

grant references on table "public"."user_credits" to "authenticated";

grant select on table "public"."user_credits" to "authenticated";

grant trigger on table "public"."user_credits" to "authenticated";

grant truncate on table "public"."user_credits" to "authenticated";

grant update on table "public"."user_credits" to "authenticated";

grant delete on table "public"."user_credits" to "service_role";

grant insert on table "public"."user_credits" to "service_role";

grant references on table "public"."user_credits" to "service_role";

grant select on table "public"."user_credits" to "service_role";

grant trigger on table "public"."user_credits" to "service_role";

grant truncate on table "public"."user_credits" to "service_role";

grant update on table "public"."user_credits" to "service_role";

grant delete on table "public"."user_feedback" to "anon";

grant insert on table "public"."user_feedback" to "anon";

grant references on table "public"."user_feedback" to "anon";

grant select on table "public"."user_feedback" to "anon";

grant trigger on table "public"."user_feedback" to "anon";

grant truncate on table "public"."user_feedback" to "anon";

grant update on table "public"."user_feedback" to "anon";

grant delete on table "public"."user_feedback" to "authenticated";

grant insert on table "public"."user_feedback" to "authenticated";

grant references on table "public"."user_feedback" to "authenticated";

grant select on table "public"."user_feedback" to "authenticated";

grant trigger on table "public"."user_feedback" to "authenticated";

grant truncate on table "public"."user_feedback" to "authenticated";

grant update on table "public"."user_feedback" to "authenticated";

grant delete on table "public"."user_feedback" to "service_role";

grant insert on table "public"."user_feedback" to "service_role";

grant references on table "public"."user_feedback" to "service_role";

grant select on table "public"."user_feedback" to "service_role";

grant trigger on table "public"."user_feedback" to "service_role";

grant truncate on table "public"."user_feedback" to "service_role";

grant update on table "public"."user_feedback" to "service_role";

grant delete on table "public"."user_preferences" to "anon";

grant insert on table "public"."user_preferences" to "anon";

grant references on table "public"."user_preferences" to "anon";

grant select on table "public"."user_preferences" to "anon";

grant trigger on table "public"."user_preferences" to "anon";

grant truncate on table "public"."user_preferences" to "anon";

grant update on table "public"."user_preferences" to "anon";

grant delete on table "public"."user_preferences" to "authenticated";

grant insert on table "public"."user_preferences" to "authenticated";

grant references on table "public"."user_preferences" to "authenticated";

grant select on table "public"."user_preferences" to "authenticated";

grant trigger on table "public"."user_preferences" to "authenticated";

grant truncate on table "public"."user_preferences" to "authenticated";

grant update on table "public"."user_preferences" to "authenticated";

grant delete on table "public"."user_preferences" to "service_role";

grant insert on table "public"."user_preferences" to "service_role";

grant references on table "public"."user_preferences" to "service_role";

grant select on table "public"."user_preferences" to "service_role";

grant trigger on table "public"."user_preferences" to "service_role";

grant truncate on table "public"."user_preferences" to "service_role";

grant update on table "public"."user_preferences" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";


  create policy "Anyone can create analytics"
  on "public"."analytics_events"
  as permissive
  for insert
  to public
with check (true);



  create policy "Users can view their own analytics"
  on "public"."analytics_events"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can create deadlines for their cases"
  on "public"."case_deadlines"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_deadlines.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can delete deadlines for their cases"
  on "public"."case_deadlines"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_deadlines.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can update deadlines for their cases"
  on "public"."case_deadlines"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_deadlines.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can view deadlines for their cases"
  on "public"."case_deadlines"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_deadlines.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can create events for their cases"
  on "public"."case_events"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_events.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can delete events for their cases"
  on "public"."case_events"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_events.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can update events for their cases"
  on "public"."case_events"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_events.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can view events for their cases"
  on "public"."case_events"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_events.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can create milestones for their cases"
  on "public"."case_milestones"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_milestones.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can delete milestones for their cases"
  on "public"."case_milestones"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_milestones.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can update milestones for their cases"
  on "public"."case_milestones"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_milestones.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can view milestones for their cases"
  on "public"."case_milestones"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = case_milestones.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can create their own cases"
  on "public"."cases"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can delete their own cases"
  on "public"."cases"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can update their own cases"
  on "public"."cases"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own cases"
  on "public"."cases"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Document templates are publicly viewable"
  on "public"."document_templates"
  as permissive
  for select
  to public
using (true);



  create policy "Users can create their own documents"
  on "public"."documents"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can delete their own documents"
  on "public"."documents"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can update their own documents"
  on "public"."documents"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own documents"
  on "public"."documents"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Admins can manage entitlements"
  on "public"."entitlements"
  as permissive
  for all
  to public
using (public.has_role(auth.uid(), 'admin'::public.app_role))
with check (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Users can view own entitlements"
  on "public"."entitlements"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own entitlements"
  on "public"."entitlements"
  as permissive
  for select
  to authenticated
using ((user_id = auth.uid()));



  create policy "entitlements_read_own"
  on "public"."entitlements"
  as permissive
  for select
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Users can add evidence to their cases"
  on "public"."evidence"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = evidence.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can delete evidence for their cases"
  on "public"."evidence"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = evidence.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can update evidence for their cases"
  on "public"."evidence"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = evidence.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can view evidence for their cases"
  on "public"."evidence"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = evidence.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can view analysis for their evidence"
  on "public"."evidence_analysis"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM (public.evidence e
     JOIN public.cases c ON ((c.id = e.case_id)))
  WHERE ((e.id = evidence_analysis.evidence_id) AND (c.user_id = auth.uid())))));



  create policy "Users can manage metadata for their evidence"
  on "public"."evidence_metadata"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM (public.evidence e
     JOIN public.cases c ON ((c.id = e.case_id)))
  WHERE ((e.id = evidence_metadata.evidence_id) AND (c.user_id = auth.uid())))));



  create policy "features_read_all"
  on "public"."features"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Users can create their own form usage"
  on "public"."form_usage"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own form usage"
  on "public"."form_usage"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own form usage"
  on "public"."form_usage"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Forms are publicly viewable"
  on "public"."forms"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "Users can create leads"
  on "public"."leads"
  as permissive
  for insert
  to public
with check (true);



  create policy "Users can view their own leads"
  on "public"."leads"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "System can create pathways"
  on "public"."legal_pathways"
  as permissive
  for insert
  to public
with check (true);



  create policy "Users can view pathways for their cases"
  on "public"."legal_pathways"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.cases
  WHERE ((cases.id = legal_pathways.case_id) AND (cases.user_id = auth.uid())))));



  create policy "Users can create their own applications"
  on "public"."low_income_applications"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own applications"
  on "public"."low_income_applications"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own applications"
  on "public"."low_income_applications"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can update their own notifications"
  on "public"."notifications"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own notifications"
  on "public"."notifications"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own orders"
  on "public"."orders"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "orders_read_own"
  on "public"."orders"
  as permissive
  for select
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Users can view their own payments"
  on "public"."payments"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "plan_features_read_all"
  on "public"."plan_features"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "prices_read_all"
  on "public"."prices"
  as permissive
  for select
  to anon, authenticated
using ((active = true));



  create policy "products_read_all"
  on "public"."products"
  as permissive
  for select
  to anon, authenticated
using ((active = true));



  create policy "Profiles are viewable by everyone"
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Users can insert their own profile"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Active programs are publicly viewable"
  on "public"."programs"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "Users can create referral codes"
  on "public"."referral_codes"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view their own referral codes"
  on "public"."referral_codes"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their referrals"
  on "public"."referrals"
  as permissive
  for select
  to public
using (((auth.uid() = referrer_id) OR (auth.uid() = referred_id)));



  create policy "Users can manage their saved documents"
  on "public"."saved_documents"
  as permissive
  for all
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own stripe_customers"
  on "public"."stripe_customers"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "stripe_customers_read_own"
  on "public"."stripe_customers"
  as permissive
  for select
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Authenticated can read webhook events"
  on "public"."stripe_webhook_events"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can create messages for their tickets"
  on "public"."support_messages"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.support_tickets
  WHERE ((support_tickets.id = support_messages.ticket_id) AND (support_tickets.user_id = auth.uid())))));



  create policy "Users can view messages for their tickets"
  on "public"."support_messages"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.support_tickets
  WHERE ((support_tickets.id = support_messages.ticket_id) AND (support_tickets.user_id = auth.uid())))));



  create policy "Users can create tickets"
  on "public"."support_tickets"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view their own tickets"
  on "public"."support_tickets"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Approved testimonials are public"
  on "public"."testimonials"
  as permissive
  for select
  to public
using ((is_approved = true));



  create policy "Users can create testimonials"
  on "public"."testimonials"
  as permissive
  for insert
  to public
with check (true);



  create policy "Users can create their own timeline events"
  on "public"."timeline_events"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can delete their own timeline events"
  on "public"."timeline_events"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can update their own timeline events"
  on "public"."timeline_events"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own timeline events"
  on "public"."timeline_events"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Tutorial videos are publicly viewable"
  on "public"."tutorial_videos"
  as permissive
  for select
  to public
using (true);



  create policy "Users can view their credits"
  on "public"."user_credits"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can create feedback"
  on "public"."user_feedback"
  as permissive
  for insert
  to public
with check (true);



  create policy "Users can view their own feedback"
  on "public"."user_feedback"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can manage their preferences"
  on "public"."user_preferences"
  as permissive
  for all
  to public
using ((auth.uid() = user_id));



  create policy "Admins can manage all roles"
  on "public"."user_roles"
  as permissive
  for all
  to public
using (public.has_role(auth.uid(), 'admin'::public.app_role))
with check (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Admins can view all roles"
  on "public"."user_roles"
  as permissive
  for select
  to public
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Users can view their own roles"
  on "public"."user_roles"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON public.forms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_low_income_applications_updated_at BEFORE UPDATE ON public.low_income_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Legal documents are publicly accessible"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'legal-docs'::text));



  create policy "Users can delete their own evidence files"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'evidence'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "Users can update their own evidence files"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'evidence'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "Users can upload their own evidence files"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'evidence'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "Users can upload their own income proof"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'income-proof'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "Users can view their own evidence files"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'evidence'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "Users can view their own income proof"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'income-proof'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



