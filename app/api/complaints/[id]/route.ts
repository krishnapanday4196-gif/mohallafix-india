import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { ComplaintStatus } from "@/types/database";

const UpdateStatusSchema = z.object({
  status: z.enum([
    "SUBMITTED",
    "UNDER_REVIEW",
    "VERIFIED",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "CITIZEN_CONFIRMED",
    "REJECTED",
    "REOPENED",
    "ESCALATED",
  ]),
  reason: z.string().min(3, "Reason or investigation note is required"),
  evidence_media_url: z.string().optional(),
  assigned_officer_id: z.string().optional(),
  department_id: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { data: null, message: "Supabase is not configured.", is_configured: false },
        { status: 200 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const isTracking = id.toUpperCase().startsWith("MHF-");

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
      ? await query.eq("tracking_id", id.toUpperCase()).maybeSingle()
      : await query.eq("id", id).maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid status update payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database service not configured." },
        { status: 503 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fetch existing complaint
    const { data: existing, error: fetchErr } = await supabase
      .from("complaints")
      .select("*, citizen:profiles(*)")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    const newStatus = parsed.data.status;
    const previousStatus = existing.status;

    // Role-based state transition validation
    if (newStatus === "CITIZEN_CONFIRMED" || newStatus === "REOPENED") {
      if (profile.role === "citizen" && existing.citizen_id !== profile.id) {
        return NextResponse.json(
          { error: "Only the complainant citizen can confirm or reopen this grievance." },
          { status: 403 }
        );
      }
    }

    // Build update object
    const updateObj: Record<string, any> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === "RESOLVED") {
      updateObj.resolved_at = new Date().toISOString();
    } else if (newStatus === "CITIZEN_CONFIRMED") {
      updateObj.confirmed_at = new Date().toISOString();
    } else if (newStatus === "REOPENED") {
      updateObj.reopen_count = (existing.reopen_count || 0) + 1;
    } else if (newStatus === "ESCALATED") {
      updateObj.escalation_level = (existing.escalation_level || 0) + 1;
    }

    if (parsed.data.assigned_officer_id) {
      updateObj.assigned_to_officer_id = parsed.data.assigned_officer_id;
    }
    if (parsed.data.department_id) {
      updateObj.department_id = parsed.data.department_id;
    }

    const { data: updated, error: updateErr } = await supabase
      .from("complaints")
      .update(updateObj)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Log in immutable complaint_status_history
    await supabase.from("complaint_status_history").insert({
      complaint_id: id,
      previous_status: previousStatus,
      new_status: newStatus,
      changed_by: profile.id,
      reason: parsed.data.reason,
      evidence_media_url: parsed.data.evidence_media_url || null,
    });

    // Notify citizen
    if (existing.citizen_id) {
      await supabase.from("notifications").insert({
        user_id: existing.citizen_id,
        complaint_id: id,
        title: `Complaint Status: ${newStatus.replace(/_/g, " ")}`,
        message: `Your complaint (${existing.tracking_id}) transitioned to ${newStatus}. Note: ${parsed.data.reason}`,
        type: "status_update",
      });
    }

    return NextResponse.json({ success: true, complaint: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

