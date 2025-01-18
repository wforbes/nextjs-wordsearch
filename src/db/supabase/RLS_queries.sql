-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_games ENABLE ROW LEVEL SECURITY;

-- This effectively blocks all operations through the anon key
-- Service role will bypass this automatically

-- Users table policies
CREATE POLICY "Prevent all access to users table for anon"
ON users
FOR ALL
USING (false);

-- Saved Games table policies
CREATE POLICY "Prevent all access to saved_games table for anon"
ON saved_games
FOR ALL
USING (false);
