import { NextResponse } from "next/server";
import { getAdminSession, canManageAdmins } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || !canManageAdmins(session.role)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { key, value, type } = await request.json();
  if (typeof key !== "string" || typeof value !== "string" || !key.trim()) {
    return NextResponse.json({ error: "Invalid key or value" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("content").upsert(
    {
      key,
      value,
      type: type ?? "text",
      updated_at: new Date().toISOString(),
      updated_by: session.email,
    },
    { onConflict: "key" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
