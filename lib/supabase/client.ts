import { createBrowserClient } from "@supabase/ssr";

export const isSupabaseConfigured = () => {
  return true;
};

export const createClient = () => {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://exsucmvjmbdvpdupfegq.supabase.co";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_wOFJoxJpHRlFW9o-RUQCVw_PgKFJeSi";

  return createBrowserClient(url, anonKey);
};
