-- ========================================================================
-- MOHALLAFIX INDIA - MIGRATION 00002: RLS POLICIES FOR WORKFLOW ACTIONS
-- Fixes "Cannot coerce the result to a single JSON object" (PGRST116)
-- Run this in Supabase Dashboard -> SQL Editor
-- ========================================================================

-- 1. TABLE: complaints (Allow authenticated users and officers to update status)
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public complaints are viewable by all" ON public.complaints;
CREATE POLICY "Public complaints are viewable by all"
  ON public.complaints FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Citizens can insert complaints" ON public.complaints;
CREATE POLICY "Citizens can insert complaints"
  ON public.complaints FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update complaints" ON public.complaints;
CREATE POLICY "Allow update complaints"
  ON public.complaints FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 2. TABLE: complaint_status_history (Allow logging status updates and resolution proof)
ALTER TABLE public.complaint_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Status history viewable by all" ON public.complaint_status_history;
CREATE POLICY "Status history viewable by all"
  ON public.complaint_status_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert status history" ON public.complaint_status_history;
CREATE POLICY "Allow insert status history"
  ON public.complaint_status_history FOR INSERT
  WITH CHECK (true);

-- 3. TABLE: complaint_media (Allow uploading defect photos and after-repair resolution proof)
ALTER TABLE public.complaint_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Complaint media viewable by all" ON public.complaint_media;
CREATE POLICY "Complaint media viewable by all"
  ON public.complaint_media FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert complaint media" ON public.complaint_media;
CREATE POLICY "Allow insert complaint media"
  ON public.complaint_media FOR INSERT
  WITH CHECK (true);

-- 4. TABLE: notifications (Allow system notifications for citizens on status change)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Notifications viewable by all" ON public.notifications;
CREATE POLICY "Notifications viewable by all"
  ON public.notifications FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert notifications" ON public.notifications;
CREATE POLICY "Allow insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- 5. TABLE: officers (Allow viewing and syncing officer records)
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Officers viewable by all" ON public.officers;
CREATE POLICY "Officers viewable by all"
  ON public.officers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert officers" ON public.officers;
CREATE POLICY "Allow insert officers"
  ON public.officers FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update officers" ON public.officers;
CREATE POLICY "Allow update officers"
  ON public.officers FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 6. TABLE: profiles (Ensure full access for profile sync during OAuth)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by all" ON public.profiles;
CREATE POLICY "Public profiles are viewable by all"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert profile" ON public.profiles;
CREATE POLICY "Allow insert profile"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update profile" ON public.profiles;
CREATE POLICY "Allow update profile"
  ON public.profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 7. TABLE: complaint_comments (Allow citizen-officer thread comments)
ALTER TABLE public.complaint_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments viewable by all" ON public.complaint_comments;
CREATE POLICY "Comments viewable by all"
  ON public.complaint_comments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert comments" ON public.complaint_comments;
CREATE POLICY "Allow insert comments"
  ON public.complaint_comments FOR INSERT
  WITH CHECK (true);

-- 8. TABLE: feedback (Allow citizen resolution feedback)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Feedback viewable by all" ON public.feedback;
CREATE POLICY "Feedback viewable by all"
  ON public.feedback FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert feedback" ON public.feedback;
CREATE POLICY "Allow insert feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);
