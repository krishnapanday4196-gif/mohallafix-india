-- ========================================================================
-- MOHALLAFIX INDIA - INITIAL DATABASE MIGRATION
-- Production-Ready Schema for Public Problem Management Platform
-- ========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------
-- 1. ENUMS
-- ------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM ('citizen', 'officer', 'admin', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE complaint_status_enum AS ENUM (
    'SUBMITTED',
    'UNDER_REVIEW',
    'VERIFIED',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED',
    'CITIZEN_CONFIRMED',
    'REJECTED',
    'REOPENED',
    'ESCALATED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE complaint_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE assignment_status_enum AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------
-- 2. TABLE: profiles
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role user_role_enum NOT NULL DEFAULT 'citizen',
  avatar_url TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 3. TABLE: user_roles
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  role user_role_enum NOT NULL,
  granted_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_roles_unique UNIQUE (user_id, role)
);

-- ------------------------------------------------------------------------
-- 4. TABLE: departments
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  jurisdiction_area TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 5. TABLE: officers
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
  badge_number TEXT UNIQUE NOT NULL,
  designation TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 6. TABLE: geographic_areas
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.geographic_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  city_or_block TEXT NOT NULL,
  ward_or_zone TEXT,
  pincode VARCHAR(10) NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 7. TABLE: complaint_categories
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  sla_hours INT NOT NULL DEFAULT 48,
  priority_level complaint_priority_enum NOT NULL DEFAULT 'MEDIUM',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 8. TABLE: complaints
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(32) UNIQUE NOT NULL,
  citizen_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  category_id UUID NOT NULL REFERENCES public.complaint_categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status complaint_status_enum NOT NULL DEFAULT 'SUBMITTED',
  priority complaint_priority_enum NOT NULL DEFAULT 'MEDIUM',
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  verified_at TIMESTAMPTZ,
  assigned_to_officer_id UUID REFERENCES public.officers(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  reopen_count INT NOT NULL DEFAULT 0,
  escalation_level INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 9. TABLE: complaint_media
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  media_type VARCHAR(16) NOT NULL CHECK (media_type IN ('image', 'video')),
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  is_resolution_evidence BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 10. TABLE: complaint_assignments
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  officer_id UUID NOT NULL REFERENCES public.officers(id) ON DELETE RESTRICT,
  assigned_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status assignment_status_enum NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  rejection_reason TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------
-- 11. TABLE: complaint_status_history
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  previous_status complaint_status_enum,
  new_status complaint_status_enum NOT NULL,
  changed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  reason TEXT,
  evidence_media_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 12. TABLE: complaint_comments
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  comment TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 13. TABLE: notifications
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(32) NOT NULL DEFAULT 'status_update',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 14. TABLE: feedback
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID UNIQUE NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  citizen_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 15. TABLE: activity_logs
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 16. TABLE: ai_analysis
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID UNIQUE NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  predicted_category_id UUID REFERENCES public.complaint_categories(id) ON DELETE SET NULL,
  classification_confidence DOUBLE PRECISION,
  priority_score DOUBLE PRECISION,
  priority_reasoning TEXT,
  duplicate_score DOUBLE PRECISION,
  matched_complaint_id UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
  raw_response JSONB,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 17. TABLE: saved_locations
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 18. TABLE: escalation_records
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.escalation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  escalated_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  escalation_reason TEXT NOT NULL,
  previous_officer_id UUID REFERENCES public.officers(id) ON DELETE SET NULL,
  target_level TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------
-- 19. INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_complaints_tracking_id ON public.complaints(tracking_id);
CREATE INDEX IF NOT EXISTS idx_complaints_citizen_id ON public.complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints(category_id);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON public.complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned_officer ON public.complaints(assigned_to_officer_id);
CREATE INDEX IF NOT EXISTS idx_complaints_coords ON public.complaints(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_complaint_media_complaint ON public.complaint_media(complaint_id);
CREATE INDEX IF NOT EXISTS idx_complaint_history_complaint ON public.complaint_status_history(complaint_id);
CREATE INDEX IF NOT EXISTS idx_complaint_comments_complaint ON public.complaint_comments(complaint_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at DESC);

-- ------------------------------------------------------------------------
-- 20. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geographic_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_records ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view basic profiles, users can insert and update their own
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Complaints: Public complaints viewable by everyone; citizens can view/insert own
CREATE POLICY "Public complaints are viewable by all"
  ON public.complaints FOR SELECT
  USING (is_public = true OR auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = citizen_id));

CREATE POLICY "Citizens can insert complaints"
  ON public.complaints FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = citizen_id));

-- Departments & Categories: Public read
CREATE POLICY "Categories viewable by all"
  ON public.complaint_categories FOR SELECT
  USING (true);

CREATE POLICY "Departments viewable by all"
  ON public.departments FOR SELECT
  USING (true);

-- ------------------------------------------------------------------------
-- 21. INITIAL SYSTEM SEED DATA (Standard civic categories & departments)
-- ------------------------------------------------------------------------
INSERT INTO public.departments (name, code, description, contact_email, is_active)
VALUES
  ('Public Works Department (Roads & Bridges)', 'PWD-ROADS', 'Maintenance of roads, flyovers, potholes, and public walkways', 'pwd.roads@mohallafix.gov.in', true),
  ('Municipal Sanitation & Waste Management', 'SWACHH-CELL', 'Solid waste collection, litter cleanup, and neighborhood sanitation', 'swachh@mohallafix.gov.in', true),
  ('Jal Board & Public Water Supply', 'WATER-BOARD', 'Potable water pipelines, pressure issues, and leak repairs', 'water@mohallafix.gov.in', true),
  ('Electricity & Street Lighting Board', 'STREETLIGHT-DEPT', 'Street light maintenance, dark spots, and public power safety', 'lights@mohallafix.gov.in', true),
  ('Stormwater Drainage & Sewerage Division', 'DRAINAGE-DEPT', 'Underground sewage, stormwater drainage, and overflow prevention', 'drainage@mohallafix.gov.in', true),
  ('Urban Parks & Public Horticulture', 'PARKS-DEPT', 'Public park maintenance, tree safety, and community green spaces', 'parks@mohallafix.gov.in', true),
  ('Public Infrastructure & Civic Assets', 'CIVIC-INFRA', 'Bus shelters, public barriers, footpaths, and public utilities', 'infra@mohallafix.gov.in', true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.complaint_categories (name, slug, description, department_id, sla_hours, priority_level, is_active)
SELECT 
  'Road Damage and Potholes',
  'road-damage-potholes',
  'Potholes, broken asphalt, road caving, and damaged road dividers',
  id, 48, 'HIGH', true
FROM public.departments WHERE code = 'PWD-ROADS'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.complaint_categories (name, slug, description, department_id, sla_hours, priority_level, is_active)
SELECT 
  'Garbage and Sanitation',
  'garbage-sanitation',
  'Uncollected garbage dump, public bin overflow, and organic waste accumulation',
  id, 24, 'HIGH', true
FROM public.departments WHERE code = 'SWACHH-CELL'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.complaint_categories (name, slug, description, department_id, sla_hours, priority_level, is_active)
SELECT 
  'Water Supply and Leakage',
  'water-supply-leakage',
  'Pipeline leaks, contaminated water supply, low water pressure, and pipeline bursts',
  id, 24, 'CRITICAL', true
FROM public.departments WHERE code = 'WATER-BOARD'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.complaint_categories (name, slug, description, department_id, sla_hours, priority_level, is_active)
SELECT 
  'Street Light Problems',
  'street-light-problems',
  'Non-functioning streetlights, exposed electrical wires, and neighborhood dark spots',
  id, 48, 'MEDIUM', true
FROM public.departments WHERE code = 'STREETLIGHT-DEPT'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.complaint_categories (name, slug, description, department_id, sla_hours, priority_level, is_active)
SELECT 
  'Drainage and Sewer',
  'drainage-and-sewer',
  'Blocked drainage lines, open manholes, sewer overflow, and rainwater stagnation',
  id, 36, 'CRITICAL', true
FROM public.departments WHERE code = 'DRAINAGE-DEPT'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.complaint_categories (name, slug, description, department_id, sla_hours, priority_level, is_active)
SELECT 
  'Public Infrastructure',
  'public-infrastructure',
  'Damaged footpaths, broken public benches, open utility pits, and barrier damage',
  id, 72, 'MEDIUM', true
FROM public.departments WHERE code = 'CIVIC-INFRA'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.complaint_categories (name, slug, description, department_id, sla_hours, priority_level, is_active)
SELECT 
  'Public Park Maintenance',
  'public-park-maintenance',
  'Overgrown vegetation, broken children playground equipment, and damaged walking tracks',
  id, 96, 'LOW', true
FROM public.departments WHERE code = 'PARKS-DEPT'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.complaint_categories (name, slug, description, department_id, sla_hours, priority_level, is_active)
VALUES 
  ('Other Public Problems', 'other-public-problems', 'Other civic and infrastructure concerns requiring municipal attention', null, 72, 'MEDIUM', true)
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------------------
-- 22. AUTOMATIC PROFILE CREATION TRIGGER FOR AUTH USERS
-- ------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1),
      CASE WHEN NEW.phone IS NOT NULL THEN 'Citizen ' || RIGHT(NEW.phone, 4) ELSE 'Citizen User' END
    ),
    NEW.email,
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
    'citizen',
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


