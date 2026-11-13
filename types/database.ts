export type UserRole = "citizen" | "officer" | "admin" | "super_admin";

export type ComplaintStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CITIZEN_CONFIRMED"
  | "REJECTED"
  | "REOPENED"
  | "ESCALATED";

export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  address?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  granted_by?: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  jurisdiction_area?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Officer {
  id: string;
  profile_id: string;
  department_id: string;
  badge_number: string;
  designation: string;
  is_verified: boolean;
  verified_by?: string | null;
  verified_at?: string | null;
  created_at: string;
  // Joined fields
  profile?: Profile;
  department?: Department;
}

export interface GeographicArea {
  id: string;
  state: string;
  district: string;
  city_or_block: string;
  ward_or_zone?: string | null;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  is_active: boolean;
  created_at: string;
}

export interface ComplaintCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  department_id?: string | null;
  sla_hours: number;
  priority_level: ComplaintPriority;
  is_active: boolean;
  created_at: string;
  // Joined fields
  department?: Department;
}

export interface ComplaintMedia {
  id: string;
  complaint_id: string;
  uploader_id: string;
  media_type: "image" | "video";
  file_url: string;
  file_size?: number | null;
  mime_type?: string | null;
  is_resolution_evidence: boolean;
  created_at: string;
}

export interface ComplaintAssignment {
  id: string;
  complaint_id: string;
  officer_id: string;
  assigned_by: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
  notes?: string | null;
  rejection_reason?: string | null;
  assigned_at: string;
  responded_at?: string | null;
  // Joined fields
  officer?: Officer;
}

export interface ComplaintStatusHistory {
  id: string;
  complaint_id: string;
  previous_status?: ComplaintStatus | null;
  new_status: ComplaintStatus;
  changed_by: string;
  reason?: string | null;
  evidence_media_url?: string | null;
  created_at: string;
  // Joined fields
  changer?: Profile;
}

export interface ComplaintComment {
  id: string;
  complaint_id: string;
  user_id: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
  // Joined fields
  author?: Profile;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  complaint_id?: string | null;
  title: string;
  message: string;
  type: "status_update" | "assignment" | "alert" | "system";
  is_read: boolean;
  created_at: string;
}

export interface FeedbackRecord {
  id: string;
  complaint_id: string;
  citizen_id: string;
  rating: number; // 1 to 5
  comments?: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string | null;
  action: string;
  resource: string;
  resource_id?: string | null;
  details?: Record<string, unknown> | null;
  ip_address?: string | null;
  created_at: string;
  // Joined fields
  user?: Profile;
}

export interface AIAnalysis {
  id: string;
  complaint_id: string;
  model_name: string;
  model_version: string;
  predicted_category_id?: string | null;
  classification_confidence?: number | null;
  priority_score?: number | null;
  priority_reasoning?: string | null;
  duplicate_score?: number | null;
  matched_complaint_id?: string | null;
  raw_response?: Record<string, unknown> | null;
  analyzed_at: string;
}

export interface SavedLocation {
  id: string;
  user_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface EscalationRecord {
  id: string;
  complaint_id: string;
  escalated_by: string;
  escalation_reason: string;
  previous_officer_id?: string | null;
  target_level: "WARD_OFFICER" | "DISTRICT_MAGISTRATE" | "CHIEF_ENGINEER" | "SUPER_ADMIN";
  status: "OPEN" | "REVIEWED" | "RESOLVED";
  resolution_notes?: string | null;
  created_at: string;
  resolved_at?: string | null;
}

export interface Complaint {
  id: string;
  tracking_id: string;
  citizen_id: string;
  category_id: string;
  title: string;
  description: string;
  address: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  department_id?: string | null;
  is_public: boolean;
  verified_at?: string | null;
  assigned_to_officer_id?: string | null;
  resolved_at?: string | null;
  confirmed_at?: string | null;
  rejection_reason?: string | null;
  reopen_count: number;
  escalation_level: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  citizen?: Profile;
  category?: ComplaintCategory;
  department?: Department;
  assigned_officer?: Officer;
  media?: ComplaintMedia[];
  status_history?: ComplaintStatusHistory[];
  comments?: ComplaintComment[];
  ai_analysis?: AIAnalysis;
  feedback?: FeedbackRecord;
}

