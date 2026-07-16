import { NextResponse } from "next/server";
import { getAdminSession, canManageAdmins } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const BUCKET = "site-images";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || !canManageAdmins(session.role)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const key = formData.get("key");

  if (!(file instanceof File) || typeof key !== "string" || !key.trim()) {
    return NextResponse.json({ error: "Invalid file or key" }, { status: 400 });
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${key.replace(/[^a-zA-Z0-9._-]/g, "_")}-${Date.now()}.${extension}`;

  const supabase = createSupabaseAdminClient();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error: dbError } = await supabase.from("content").upsert(
    {
      key,
      value: data.publicUrl,
      type: "image",
      updated_at: new Date().toISOString(),
      updated_by: session.email,
    },
    { onConflict: "key" },
  );

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ url: data.publicUrl });
}
