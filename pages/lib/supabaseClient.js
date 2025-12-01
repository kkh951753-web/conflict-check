import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl) {
  console.error("❌ ERROR: NEXT_PUBLIC_SUPABASE_URL is missing in .env.local");
}
if (!supabaseKey) {
  console.error("❌ ERROR: NEXT_PUBLIC_SUPABASE_KEY is missing in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
