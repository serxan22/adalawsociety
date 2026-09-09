import { cmsFailure, cmsResponse } from "@/lib/cms/http";
import { getLookups, requireCmsApi } from "@/lib/cms/server";
export async function GET() {
  try { const {db,session} = await requireCmsApi(); return cmsResponse({...await getLookups(db),userId:session.userId,email:session.email}); }
  catch(error) { return cmsFailure(error); }
}
