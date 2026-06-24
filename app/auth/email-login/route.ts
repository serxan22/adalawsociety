import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email: string = body.email ?? "";
    const password: string = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const { data: adminRow } = await supabase
      .from("admins")
      .select("role")
      .eq("email", email)
      .single();

    if (!adminRow) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Your account does not have admin access." },
        { status: 403 },
      );
    }

    return NextResponse.json({ success: true, role: adminRow.role });
  } catch {
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
