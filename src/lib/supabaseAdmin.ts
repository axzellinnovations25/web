import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const hasServiceRole = Boolean(supabaseUrl && serviceRoleKey);

/**
 * Admin client with service role key — bypasses RLS and can create auth users.
 * NOTE: Only safe in server-side code or trusted admin environments.
 * For production, move doctor creation to a Supabase Edge Function.
 */
export const supabaseAdmin = hasServiceRole
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
