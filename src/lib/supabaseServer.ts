import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Create a Supabase server client using the service role key.
 * This is created lazily at request time to avoid build-time errors when env vars
 * are not available during static builds.
 */
export function createSupabaseServer(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.warn(
      "Supabase server client: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Server upload endpoint will fail if these are not set."
    );
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
