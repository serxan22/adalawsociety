import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

const publicAdminPaths = new Set(["/admin/login"]);

function redirectToLogin(request: NextRequest, reason?: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  if (reason) {
    loginUrl.searchParams.set("error", reason);
  }

  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin") || publicAdminPaths.has(pathname)) {
    return NextResponse.next();
  }

  const config = getSupabaseConfig();

  if (!config) {
    return redirectToLogin(request, "supabase-not-configured");
  }

  const response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();

  if (!email) {
    return redirectToLogin(request, "login-required");
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("role")
    .eq("email", email)
    .maybeSingle<{ role: string }>();

  if (!admin) {
    return redirectToLogin(request, "admin-access-required");
  }

  if (pathname.startsWith("/admin/users") && admin.role !== "superadmin") {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.searchParams.set("error", "superadmin-required");
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
