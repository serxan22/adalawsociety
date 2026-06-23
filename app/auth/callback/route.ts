import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/admin";
  const supabase = await createSupabaseServerClient();

  if (!supabase || !code) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=oauth-callback-invalid&next=${encodeURIComponent(next)}`, url),
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=oauth-callback-failed&next=${encodeURIComponent(next)}`, url),
    );
  }

  return NextResponse.redirect(new URL(next, url));
}
