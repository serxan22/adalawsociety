import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseProjectUrl } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes; skip /admin/login and /auth/*.
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    const supabase = createServerClient(
      getSupabaseProjectUrl(),
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      loginUrl.searchParams.set("error", "login-required");
      return NextResponse.redirect(loginUrl);
    }

    const { data: adminRow } = await supabase
      .from("admins")
      .select("role")
      .eq("email", user.email!)
      .single();

    if (!adminRow) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "not-authorized");
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
