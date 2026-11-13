import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  Department,
  ComplaintStatusHistory,
} from "@/types/database";
import { generateTrackingId } from "@/lib/utils";

// Initial fallback categories matching the standard SQL seed
export const DEFAULT_CATEGORIES: Partial<ComplaintCategory>[] = [
  { id: "cat-1", name: "Road Damage and Potholes", slug: "road-damage-potholes", sla_hours: 48, priority_level: "HIGH" },
  { id: "cat-2", name: "Garbage and Sanitation", slug: "garbage-sanitation", sla_hours: 24, priority_level: "HIGH" },
  { id: "cat-3", name: "Water Supply and Leakage", slug: "water-supply-leakage", sla_hours: 24, priority_level: "CRITICAL" },
  { id: "cat-4", name: "Street Light Problems", slug: "street-light-problems", sla_hours: 48, priority_level: "MEDIUM" },
  { id: "cat-5", name: "Drainage and Sewer", slug: "drainage-and-sewer", sla_hours: 36, priority_level: "CRITICAL" },
  { id: "cat-6", name: "Public Infrastructure", slug: "public-infrastructure", sla_hours: 72, priority_level: "MEDIUM" },
  { id: "cat-7", name: "Public Park Maintenance", slug: "public-park-maintenance", sla_hours: 96, priority_level: "LOW" },
  { id: "cat-8", name: "Other Public Problems", slug: "other-public-problems", sla_hours: 72, priority_level: "MEDIUM" },
];

export const DEFAULT_DEPARTMENTS: Partial<Department>[] = [
  { id: "dept-1", name: "Public Works Department (Roads & Bridges)", code: "PWD-ROADS" },
  { id: "dept-2", name: "Municipal Sanitation & Waste Management", code: "SWACHH-CELL" },
  { id: "dept-3", name: "Jal Board & Public Water Supply", code: "WATER-BOARD" },
  { id: "dept-4", name: "Electricity & Street Lighting Board", code: "STREETLIGHT-DEPT" },
  { id: "dept-5", name: "Stormwater Drainage & Sewerage Division", code: "DRAINAGE-DEPT" },
  { id: "dept-6", name: "Urban Parks & Public Horticulture", code: "PARKS-DEPT" },
  { id: "dept-7", name: "Public Infrastructure & Civic Assets", code: "CIVIC-INFRA" },
];

export async function fetchCategories(): Promise<ComplaintCategory[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_CATEGORIES as ComplaintCategory[];
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("complaint_categories")
      .select("*, department:departments(*)")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CATEGORIES as ComplaintCategory[];
    }
    return data as ComplaintCategory[];
  } catch {
    return DEFAULT_CATEGORIES as ComplaintCategory[];
  }
}

export async function fetchDepartments(): Promise<Department[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_DEPARTMENTS as Department[];
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_DEPARTMENTS as Department[];
    }
    return data as Department[];
  } catch {
    return DEFAULT_DEPARTMENTS as Department[];
  }
}

export async function fetchPublicComplaints(filters?: {
  categoryId?: string;
  status?: string;
  search?: string;
  limit?: number;
}): Promise<Complaint[]> {
  if (!isSupabaseConfigured()) {
    // Zero demo data policy: Return empty array when database is unconfigured or has no records
    return [];
  }

  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from("complaints")
      .select(`
        *,
        category:complaint_categories(*),
        department:departments(*),
        assigned_officer:officers(*),
        media:complaint_media(*)
      `)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (filters?.categoryId) {
      query = query.eq("category_id", filters.categoryId);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tracking_id.ilike.%${filters.search}%`
      );
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as Complaint[];
  } catch {
    return [];
  }
}

export async function fetchComplaintByIdOrTracking(idOrTracking: string): Promise<Complaint | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const isTracking = idOrTracking.toUpperCase().startsWith("MHF-");

    const query = supabase
      .from("complaints")
      .select(`
        *,
        category:complaint_categories(*),
        department:departments(*),
        assigned_officer:officers(*, profile:profiles!officers_profile_id_fkey(*)),
        citizen:profiles(*),
        media:complaint_media(*),
        status_history:complaint_status_history(*, changer:profiles!complaint_status_history_changed_by_fkey(*)),
        comments:complaint_comments(*, author:profiles!complaint_comments_user_id_fkey(*)),
        feedback:feedback(*)
      `);

    const { data, error } = isTracking
      ? await query.eq("tracking_id", idOrTracking.toUpperCase()).maybeSingle()
      : await query.eq("id", idOrTracking).maybeSingle();

    if (error || !data) return null;
    return data as Complaint;
  } catch {
    return null;
  }
}

export async function getAnalyticsMetrics() {
  if (!isSupabaseConfigured()) {
    // Honest zero state when no real records exist
    return {
      total: 0,
      submitted: 0,
      under_review: 0,
      verified: 0,
      assigned: 0,
      in_progress: 0,
      resolved: 0,
      citizen_confirmed: 0,
      reopened: 0,
      escalated: 0,
      categoryDistribution: [] as { name: string; count: number }[],
      departmentWorkload: [] as { name: string; count: number }[],
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: complaints, error } = await supabase
      .from("complaints")
      .select("status, category:complaint_categories(name), department:departments(name)");

    if (error || !complaints) {
      return {
        total: 0,
        submitted: 0,
        under_review: 0,
        verified: 0,
        assigned: 0,
        in_progress: 0,
        resolved: 0,
        citizen_confirmed: 0,
        reopened: 0,
        escalated: 0,
        categoryDistribution: [],
        departmentWorkload: [],
      };
    }

    const counts = {
      total: complaints.length,
      submitted: 0,
      under_review: 0,
      verified: 0,
      assigned: 0,
      in_progress: 0,
      resolved: 0,
      citizen_confirmed: 0,
      reopened: 0,
      escalated: 0,
    };

    const catMap: Record<string, number> = {};
    const deptMap: Record<string, number> = {};

    complaints.forEach((c: any) => {
      const st = (c.status || "").toLowerCase();
      if (st === "submitted") counts.submitted++;
      else if (st === "under_review") counts.under_review++;
      else if (st === "verified") counts.verified++;
      else if (st === "assigned") counts.assigned++;
      else if (st === "in_progress") counts.in_progress++;
      else if (st === "resolved") counts.resolved++;
      else if (st === "citizen_confirmed") counts.citizen_confirmed++;
      else if (st === "reopened") counts.reopened++;
      else if (st === "escalated") counts.escalated++;

      const catName = c.category?.name || "Uncategorized";
      catMap[catName] = (catMap[catName] || 0) + 1;

      const deptName = c.department?.name || "Unassigned Dept";
      deptMap[deptName] = (deptMap[deptName] || 0) + 1;
    });

    const categoryDistribution = Object.entries(catMap).map(([name, count]) => ({
      name,
      count,
    }));
    const departmentWorkload = Object.entries(deptMap).map(([name, count]) => ({
      name,
      count,
    }));

    return {
      ...counts,
      categoryDistribution,
      departmentWorkload,
    };
  } catch {
    return {
      total: 0,
      submitted: 0,
      under_review: 0,
      verified: 0,
      assigned: 0,
      in_progress: 0,
      resolved: 0,
      citizen_confirmed: 0,
      reopened: 0,
      escalated: 0,
      categoryDistribution: [],
      departmentWorkload: [],
    };
  }
}

