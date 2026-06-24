import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") ?? "/admin";
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${request.nextUrl.origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(`${request.nextUrl.origin}/admin/login?error=oauth-failed`);
  }

  return NextResponse.redirect(data.url);
}
