-- supabase/seeds/seed_testing_users.sql
-- NOTE: Creating auth.users directly requires a service role key. The recommended flow is:
-- 1) Use Supabase Dashboard or CLI to create two real user accounts (via email/password): userA@example.com and userB@example.com
-- 2) After creating them, copy their user IDs and replace the placeholders below, or run the seed with a service role key.

-- Replace these with real user IDs from your Supabase auth users
-- EXAMPLE:
-- \set user_a '11111111-1111-1111-1111-111111111111'
-- \set user_b '22222222-2222-2222-2222-222222222222'

-- Insert sample profiles (replace :user_a and :user_b)
-- INSERT INTO profiles (user_id, display_name, email) VALUES ('11111111-1111-1111-1111-111111111111', 'User A', 'userA@example.com');
-- INSERT INTO profiles (user_id, display_name, email) VALUES ('22222222-2222-2222-2222-222222222222', 'User B', 'userB@example.com');

-- Insert sample subjects for each user
-- INSERT INTO subjects (user_id, name) VALUES ('11111111-1111-1111-1111-111111111111', 'Math');
-- INSERT INTO subjects (user_id, name) VALUES ('22222222-2222-2222-2222-222222222222', 'History');

-- Insert a note for user A and user B
-- INSERT INTO notes (user_id, title, color) VALUES ('11111111-1111-1111-1111-111111111111', 'A note', 'yellow');
-- INSERT INTO notes (user_id, title, color) VALUES ('22222222-2222-2222-2222-222222222222', 'B note', 'blue');

-- The seeds are intentionally left as commented templates because inserting auth.users or acting as service-role must be done with proper credentials.
