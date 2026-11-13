import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/citizen";

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const origin = forwardedHost
    ? (isLocalEnv ? `http://${forwardedHost}` : `https://${forwardedHost}`)
    : requestUrl.origin;

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Auto-create or sync citizen profile
      try {
        await supabase.from("profiles").upsert({
          user_id: data.user.id,
          full_name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "Citizen",
          email: data.user.email || "",
          role: "citizen",
          avatar_url: data.user.user_metadata?.avatar_url || null,
        });
      } catch (profileErr) {
        console.warn("Profile upsert during OAuth skipped:", profileErr);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}

