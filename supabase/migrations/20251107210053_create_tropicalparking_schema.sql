/*
  # TropicalParking Database Schema

  ## Overview
  Complete database schema for TropicalParking V3 airport parking management system.
  
  ## Tables Created
  
  ### 1. users
  - `id` (uuid, primary key) - User identifier
  - `email` (text, unique) - User email address
  - `first_name` (text) - User first name
  - `last_name` (text) - User last name
  - `phone` (text) - Phone number
  - `role` (text) - User role (customer/admin)
  - `loyalty_points` (integer) - Accumulated loyalty points
  - `loyalty_tier` (text) - Tier level (bronze/silver/gold)
  - `is_active` (boolean) - Account active status
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. locations
  - `id` (uuid, primary key) - Location identifier
  - `name` (text) - Location name
  - `airport_code` (text) - Airport code (FLL/YYZ)
  - `airport_name` (text) - Full airport name
  - `address` (jsonb) - Complete address object
  - `coordinates` (jsonb) - Lat/lng coordinates
  - `pricing` (jsonb) - Pricing structure (daily/weekly/monthly)
  - `features` (text[]) - Array of features
  - `capacity_total` (integer) - Total parking capacity
  - `capacity_available` (integer) - Available spots
  - `operating_hours` (jsonb) - Open/close times
  - `images` (jsonb[]) - Array of image objects
  - `rating_average` (numeric) - Average rating
  - `rating_count` (integer) - Number of ratings
  - `is_active` (boolean) - Location active status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. bookings
  - `id` (uuid, primary key) - Booking identifier
  - `user_id` (uuid, foreign key) - References users
  - `location_id` (uuid, foreign key) - References locations
  - `vehicle` (jsonb) - Vehicle information
  - `check_in` (timestamptz) - Check-in date/time
  - `check_out` (timestamptz) - Check-out date/time
  - `daily_rate` (numeric) - Daily parking rate
  - `total_days` (integer) - Number of days
  - `subtotal` (numeric) - Subtotal amount
  - `discount` (numeric) - Discount amount
  - `tax` (numeric) - Tax amount
  - `total` (numeric) - Total amount
  - `promo_code` (text) - Applied promo code
  - `payment_method` (text) - Payment method used
  - `payment_status` (text) - Payment status
  - `stripe_payment_id` (text) - Stripe payment ID
  - `paid_at` (timestamptz) - Payment timestamp
  - `status` (text) - Booking status
  - `notes` (text) - Additional notes
  - `cancellation_reason` (text) - Cancellation reason
  - `refund_amount` (numeric) - Refund amount
  - `loyalty_points_earned` (integer) - Points earned
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. reviews
  - `id` (uuid, primary key) - Review identifier
  - `user_id` (uuid, foreign key) - References users
  - `location_id` (uuid, foreign key) - References locations
  - `booking_id` (uuid, foreign key) - References bookings
  - `rating` (integer) - Rating 1-5
  - `title` (text) - Review title
  - `comment` (text) - Review content
  - `helpful_count` (integer) - Helpful votes
  - `is_verified` (boolean) - Verified review status
  - `is_approved` (boolean) - Admin approval status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. blog_posts
  - `id` (uuid, primary key) - Post identifier
  - `title` (text) - Post title
  - `slug` (text, unique) - URL slug
  - `content` (text) - Post content
  - `excerpt` (text) - Short excerpt
  - `author_id` (uuid, foreign key) - References users
  - `featured_image` (text) - Image URL
  - `category` (text) - Post category
  - `tags` (text[]) - Array of tags
  - `status` (text) - Post status (draft/published)
  - `views` (integer) - View count
  - `published_at` (timestamptz) - Publication date
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies restrict data access based on user authentication and ownership
  - Admin role has elevated privileges for management operations

  ## Important Notes
  1. All tables use uuid for primary keys with automatic generation
  2. Timestamps (created_at, updated_at) are managed automatically
  3. RLS policies ensure users can only access their own data
  4. Admin users have special policies for management functions
  5. Foreign key constraints maintain referential integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  loyalty_points integer DEFAULT 0,
  loyalty_tier text DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  airport_code text NOT NULL CHECK (airport_code IN ('FLL', 'YYZ')),
  airport_name text NOT NULL,
  address jsonb DEFAULT '{}',
  coordinates jsonb DEFAULT '{}',
  pricing jsonb NOT NULL DEFAULT '{"daily": 0, "weekly": 0, "monthly": 0}',
  features text[] DEFAULT '{}',
  capacity_total integer NOT NULL DEFAULT 0,
  capacity_available integer NOT NULL DEFAULT 0,
  operating_hours jsonb DEFAULT '{}',
  images jsonb[] DEFAULT '{}',
  rating_average numeric(3,1) DEFAULT 0,
  rating_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  vehicle jsonb NOT NULL DEFAULT '{}',
  check_in timestamptz NOT NULL,
  check_out timestamptz NOT NULL,
  daily_rate numeric(10,2) NOT NULL DEFAULT 0,
  total_days integer DEFAULT 0,
  subtotal numeric(10,2) DEFAULT 0,
  discount numeric(10,2) DEFAULT 0,
  tax numeric(10,2) DEFAULT 0,
  total numeric(10,2) DEFAULT 0,
  promo_code text,
  payment_method text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_id text,
  paid_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  notes text,
  cancellation_reason text,
  refund_amount numeric(10,2),
  loyalty_points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text NOT NULL,
  helpful_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  featured_image text,
  category text,
  tags text[] DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_locations_airport ON locations(airport_code);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_location ON bookings(location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_reviews_location ON reviews(location_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for locations table (public read, admin write)
CREATE POLICY "Anyone can view active locations"
  ON locations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage locations"
  ON locations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for bookings table
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for reviews table
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can view own reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for blog_posts table
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can view own posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Authors can create posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Admins can manage all posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
