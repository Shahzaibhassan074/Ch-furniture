-- Enable Row Level Security on every application table.
-- The app uses the Supabase SERVICE ROLE key which bypasses RLS,
-- so enabling RLS here does NOT break anything — it only blocks
-- requests made with the anon/public key (no such requests exist in this app).
--
-- How to run:
--   1. Open Supabase dashboard → your project → SQL Editor
--   2. Paste this entire file and click "Run"
--   3. All 8 statements should complete with "Success. No rows returned."
--   4. Verify in Table Editor → each table → RLS column shows "Enabled"

ALTER TABLE products               ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings               ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials           ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_50_drafts         ENABLE ROW LEVEL SECURITY;
