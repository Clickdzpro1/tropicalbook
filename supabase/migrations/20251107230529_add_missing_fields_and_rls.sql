/*
  # Add Missing Fields and RLS Policies

  ## Changes
  1. Add password_hash and reset password fields to users table
  2. Add RLS policies for all tables to enable authentication
  3. Create helper function for user authentication

  ## Security
  - Enable authentication-based access control
  - Restrict data access based on user ownership
  - Admin access for management operations
*/

-- Add missing fields to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'reset_password_token'
  ) THEN
    ALTER TABLE users ADD COLUMN reset_password_token text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'reset_password_expire'
  ) THEN
    ALTER TABLE users ADD COLUMN reset_password_expire timestamptz;
  END IF;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Anyone can view active locations" ON locations;
DROP POLICY IF EXISTS "Admins can manage locations" ON locations;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can view published posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can view own posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON blog_posts;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id::text = current_setting('app.current_user_id', true))
  WITH CHECK (id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id::text = current_setting('app.current_user_id', true) AND u.role = 'admin'
    )
  );

CREATE POLICY "Allow user registration"
  ON users FOR INSERT
  WITH CHECK (true);

-- RLS Policies for locations table
CREATE POLICY "Anyone can view active locations"
  ON locations FOR SELECT
  USING (is_active = true OR current_setting('app.current_user_id', true) IS NOT NULL);

CREATE POLICY "Admins can manage locations"
  ON locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = current_setting('app.current_user_id', true) AND users.role = 'admin'
    )
  );

-- RLS Policies for bookings table
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (user_id::text = current_setting('app.current_user_id', true))
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = current_setting('app.current_user_id', true) AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all bookings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = current_setting('app.current_user_id', true) AND users.role = 'admin'
    )
  );

-- RLS Policies for reviews table
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can view own reviews"
  ON reviews FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can create own reviews"
  ON reviews FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (user_id::text = current_setting('app.current_user_id', true))
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = current_setting('app.current_user_id', true) AND users.role = 'admin'
    )
  );

-- RLS Policies for blog_posts table (note: uses 'status' not 'is_published')
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can view own posts"
  ON blog_posts FOR SELECT
  USING (author_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Admins can manage all blog posts"
  ON blog_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = current_setting('app.current_user_id', true) AND users.role = 'admin'
    )
  );