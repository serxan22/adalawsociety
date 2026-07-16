import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type ContentRow = {
  key: string;
  value: string;
  type: string;
};

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("content").select("key, value, type");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const content = (data as ContentRow[]).reduce<Record<string, { value: string; type: string }>>(
    (map, row) => {
      map[row.key] = { value: row.value, type: row.type };
      return map;
    },
    {},
  );

  return NextResponse.json(content);
}
