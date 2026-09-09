import { NextResponse } from "next/server";
import { CmsError } from "./server";

export const noStore = { "Cache-Control": "private, no-store, max-age=0" };
export function cmsResponse(data: unknown, status = 200) { return NextResponse.json(data, { status, headers: noStore }); }
export function cmsFailure(error: unknown) {
  if (error instanceof CmsError) return cmsResponse({ error: error.message }, error.status);
  console.error("Editorial request failed:", error instanceof Error ? error.message : "Unknown error");
  return cmsResponse({ error: "Unable to complete this request." }, 500);
}
export async function readJson(request: Request) {
  const text = await request.text();
  if (text.length > 1000000) throw new CmsError("This post is too large.", 413);
  try { return JSON.parse(text); } catch { throw new CmsError("Invalid JSON."); }
}
