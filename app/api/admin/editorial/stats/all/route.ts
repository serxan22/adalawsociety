import { cmsFailure,cmsResponse } from "@/lib/cms/http";
import { databaseError,normalizePost,postSelect,requireCmsApi } from "@/lib/cms/server";
export async function GET() {
  try {
    const {db}=await requireCmsApi();
    const totals={total:0,published:0,draft:0,unpublished:0};
    const recent:ReturnType<typeof normalizePost>[]=[];
    const published:ReturnType<typeof normalizePost>[]=[];
    for(const [table,kind] of [["articles","article"],["news","news"]] as const) {
      const results=await Promise.all([
        ...["published","draft","unpublished"].map(status=>db.from(table).select("id",{count:"exact",head:true}).eq("status",status)),
        db.from(table).select(postSelect(kind,false)).order("created_at",{ascending:false}).limit(5),
        db.from(table).select(postSelect(kind,false)).eq("status","published").order("published_at",{ascending:false}).limit(5),
      ]);
      for(const r of results)if(r.error)throw databaseError(r.error);
      totals.published+=results[0].count??0;totals.draft+=results[1].count??0;totals.unpublished+=results[2].count??0;
      recent.push(...(results[3].data??[]).map(r=>normalizePost(r as unknown as Record<string,unknown>,kind)));
      published.push(...(results[4].data??[]).map(r=>normalizePost(r as unknown as Record<string,unknown>,kind)));
    }
    totals.total=totals.published+totals.draft+totals.unpublished;
    const extra=await Promise.all([
      db.from("authors").select("id",{count:"exact",head:true}),
      db.from("gallery_items").select("id",{count:"exact",head:true}),
      db.from("team_member_photos").select("member_key",{count:"exact",head:true}),
    ]);
    const optionalCount=(result:typeof extra[number])=>{
      if(!result.error)return result.count??0;
      if(["42P01","PGRST205"].includes(result.error.code??""))return 0;
      throw databaseError(result.error);
    };
    const assets={authors:optionalCount(extra[0]),gallery:optionalCount(extra[1]),teamPhotos:optionalCount(extra[2])};
    return cmsResponse({totals,assets,recent:recent.sort((a,b)=>b.created_at.localeCompare(a.created_at)).slice(0,5),published:published.sort((a,b)=>(b.published_at??"").localeCompare(a.published_at??"")).slice(0,5)});
  }catch(e){return cmsFailure(e);}
}
