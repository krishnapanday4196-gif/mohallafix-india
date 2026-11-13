import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { generateTrackingId } from "@/lib/utils";

const CreateComplaintSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  description: z.string().min(3, "Description must be at least 3 characters"),
  category_id: z.string().min(1, "Please select a problem category"),
  address: z.string().min(2, "Please provide a specific street or landmark address"),
  pincode: z.string().optional().default("110001"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  is_public: z.boolean().default(true),
  media_urls: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category_id");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        data: [],
        message: "No complaints found yet. Supabase is not configured.",
        is_configured: false,
      });
    }

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
      .order("created_at", { ascending: false })
      .limit(limit);

    if (categoryId) query = query.eq("category_id", categoryId);
    if (status) query = query.eq("status", status);
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,tracking_id.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [], is_configured: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch complaints" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateComplaintSchema.safeParse(body);

    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `${i.path.join(".") || "field"}: ${i.message}`)
        .join(" | ");
      console.error("Complaint validation failed:", issues);
      return NextResponse.json(
        { error: `Validation failed: ${issues}`, details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error: "Database service not configured. Please supply valid Supabase credentials in .env.local to persist records.",
          is_configured: false,
        },
        { status: 503 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. You must be logged in as a citizen to file a complaint." },
        { status: 401 }
      );
    }

    // Lookup profile or auto-create if not yet generated
    let { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile) {
      const metaName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Citizen User";
      const metaAvatar =
        user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
      const metaPhone = user.phone || user.user_metadata?.phone || null;

      const { data: newProfile, error: createProfileErr } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          full_name: metaName,
          email: user.email || "",
          phone: metaPhone,
          role: "citizen",
          avatar_url: metaAvatar,
        })
        .select("id")
        .maybeSingle();

      if (newProfile) {
        profile = newProfile;
      } else {
        console.error("Auto-create profile error:", createProfileErr);
      }
    }

    if (!profile) {
      return NextResponse.json(
        {
          error:
            "Citizen profile not found. Please run the 1-minute SQL script in Supabase SQL Editor to allow profile creation (RLS Policy).",
        },
        { status: 404 }
      );
    }

    const trackingId = generateTrackingId();

    // Auto-detect department from chosen category
    let departmentId: string | null = null;
    const { data: catRecord } = await supabase
      .from("complaint_categories")
      .select("department_id")
      .eq("id", parsed.data.category_id)
      .maybeSingle();

    if (catRecord?.department_id) {
      departmentId = catRecord.department_id;
    }

    const insertPayload = {
      tracking_id: trackingId,
      citizen_id: profile.id,
      category_id: parsed.data.category_id,
      department_id: departmentId,
      title: parsed.data.title,
      description: parsed.data.description,
      address: parsed.data.address,
      pincode: parsed.data.pincode,
      latitude: parsed.data.latitude || null,
      longitude: parsed.data.longitude || null,
      priority: parsed.data.priority,
      status: "SUBMITTED",
      is_public: parsed.data.is_public,
    };

    const { data: complaint, error: insertError } = await supabase
      .from("complaints")
      .insert(insertPayload)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Insert status history entry
    await supabase.from("complaint_status_history").insert({
      complaint_id: complaint.id,
      previous_status: null,
      new_status: "SUBMITTED",
      changed_by: profile.id,
      reason: "Initial complaint submission by citizen",
    });

    // If media attached
    if (parsed.data.media_urls && parsed.data.media_urls.length > 0) {
      const mediaRecords = parsed.data.media_urls.map((url) => ({
        complaint_id: complaint.id,
        uploader_id: profile.id,
        media_type: url.endsWith(".mp4") || url.endsWith(".webm") ? "video" : "image",
        file_url: url,
        is_resolution_evidence: false,
      }));
      await supabase.from("complaint_media").insert(mediaRecords);
    }

    // Insert notification
    await supabase.from("notifications").insert({
      user_id: profile.id,
      complaint_id: complaint.id,
      title: "Complaint Registered",
      message: `Your complaint ${trackingId} has been successfully registered and queued for departmental review.`,
      type: "status_update",
    });

    return NextResponse.json({
      success: true,
      complaint,
      tracking_id: trackingId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while submitting complaint" },
      { status: 500 }
    );
  }
}

