export function getSupabaseProjectUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/rest\/v1\/?$/, "");
}
