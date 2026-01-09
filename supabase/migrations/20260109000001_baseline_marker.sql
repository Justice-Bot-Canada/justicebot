-- Baseline marker: tells Supabase “the schema is already in place”
-- Safe to re-run
insert into supabase_migrations.schema_migrations (version)
values ('20260109000000')
on conflict do nothing;
