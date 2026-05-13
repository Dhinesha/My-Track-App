/**
 * Supabase client configuration
 * Replace these with your actual Supabase credentials from https://supabase.com
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

/**
 * Initialize and export the Supabase client
 * Make sure to set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
