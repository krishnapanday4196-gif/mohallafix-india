import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/citizen";
  const roleParam = requestUrl.searchParams.get("role");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const origin = forwardedHost
    ? (isLocalEnv ? `http://${forwardedHost}` : `https://${forwardedHost}`)
    : requestUrl.origin;

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const targetRole =
        roleParam === "officer" || next.startsWith("/officer")
          ? "officer"
          : "citizen";

      // Auto-create or sync profile
      try {
        await supabase.from("profiles").upsert({
          user_id: data.user.id,
          full_name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            (targetRole === "officer" ? "Nodal Officer" : "Citizen"),
          email: data.user.email || "",
          role: targetRole,
          avatar_url: data.user.user_metadata?.avatar_url || null,
        });

        if (targetRole === "officer") {
          const { data: prof } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", data.user.id)
            .maybeSingle();

          if (prof?.id) {
            await supabase.from("officers").upsert(
              {
                profile_id: prof.id,
                badge_number: `OFF-${data.user.id.substring(0, 6).toUpperCase()}`,
                is_active: true,
              },
              { onConflict: "profile_id" }
            );
          }
        }
      } catch (profileErr) {
        console.warn("Profile upsert during OAuth skipped:", profileErr);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}

