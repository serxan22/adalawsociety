import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {join} from "node:path";
import {PGlite} from "@electric-sql/pglite";

const root=process.cwd();
const superId="10000000-0000-4000-8000-000000000001";
const outsiderId="10000000-0000-4000-8000-000000000002";
const bootstrap=`
create role anon nologin;
create role authenticated nologin;
create schema auth;
create schema storage;
create table auth.users(id uuid primary key,email text);
create or replace function auth.uid() returns uuid language sql stable as
$$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create or replace function auth.jwt() returns jsonb language sql stable as
$$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
create table public.admins(uid uuid primary key,email text unique not null,role text not null,added_at timestamptz default now());
insert into auth.users values ('${superId}','owner@example.com'),('${outsiderId}','visitor@example.com');
insert into public.admins(uid,email,role) values ('${superId}','owner@example.com','superadmin');
grant usage on schema public,auth,storage to anon,authenticated;
grant execute on function auth.uid(),auth.jwt() to anon,authenticated;
`;

async function asRole(db:PGlite,role:"anon"|"authenticated",id?:string,email?:string){
 await db.exec(`reset role; set role ${role}; set "request.jwt.claim.sub"='${id??""}'; set "request.jwt.claims"='${JSON.stringify({sub:id,email}).replaceAll("'","''")}';`);
}
test("editorial and public-media migrations enforce publication and admin boundaries",async()=>{
 const db=new PGlite();
 await db.exec(bootstrap);
 const migration3=(await readFile(join(root,"supabase/migrations/003_editorial_cms.sql"),"utf8")).replace("create extension if not exists pgcrypto;","");
 const migration4=await readFile(join(root,"supabase/migrations/004_gallery_team_media.sql"),"utf8");
 await db.exec(migration3);await db.exec(migration4);
 await asRole(db,"authenticated",superId,"owner@example.com");
 const author=(await db.query<{id:string}>("insert into public.authors(full_name,bio) values ('Official Author','Biography') returning id")).rows[0];
 const category=(await db.query<{id:string}>("insert into public.categories(name,slug) values ('Legal Research','legal-research') returning id")).rows[0];
 const tag=(await db.query<{id:string}>("insert into public.tags(name,slug) values ('Research','research') returning id")).rows[0];
 const content={type:"doc",content:[{type:"paragraph",content:[{type:"text",text:"Verified body"}]}]};
 const post=(await db.query<{id:string}>(`select public.save_editorial_post('article',null,$1::jsonb,array[$2]::uuid[],null) id`,[
  JSON.stringify({title:"Official publication",slug:"official-publication",summary:"Required abstract",excerpt:"Required excerpt",content:"Verified body",content_json:content,citations:[],cover_image:null,author_profile_id:author.id,category_id:category.id,status:"draft",published_at:null,seo_keywords:[],updated_by:"owner@example.com"}),tag.id
 ])).rows[0];
 await asRole(db,"anon");
 assert.equal((await db.query("select id from public.articles")).rows.length,0,"draft leaked publicly");
	await assert.rejects(()=>db.query("insert into public.tags(name,slug) values ('Blocked','blocked')"));
	await asRole(db,"authenticated",outsiderId,"visitor@example.com");
	const blockedUpdate=await db.query("update public.articles set status='published' where id=$1 returning id",[post.id]);
	assert.equal(blockedUpdate.rows.length,0,"non-admin updated a protected article");
	await asRole(db,"authenticated",superId,"owner@example.com");
	assert.equal((await db.query<{status:string}>("select status from public.articles where id=$1",[post.id])).rows[0]?.status,"draft");
 await db.query("update public.articles set status='published' where id=$1",[post.id]);
 await db.query("insert into public.gallery_items(image_url,alt_text,status) values ('/api/editorial/media/20000000-0000-4000-8000-000000000001','Official ALS event photo','published')");
 await db.query("insert into public.team_member_photos(member_key,image_url) values ('2025-2026-murad-iskandar-president','/api/editorial/media/20000000-0000-4000-8000-000000000002')");
 await asRole(db,"anon");
 assert.equal((await db.query("select id from public.articles")).rows.length,1);
 assert.equal((await db.query("select * from public.public_editorial_choices('article')")).rows.length,1);
 assert.equal((await db.query("select id from public.gallery_items")).rows.length,1);
 assert.equal((await db.query("select member_key from public.team_member_photos")).rows.length,1);
 await asRole(db,"authenticated",superId,"owner@example.com");
 await db.query("update public.articles set status='unpublished',published_at=null where id=$1",[post.id]);
 const retained=(await db.query<{published_at:string|null}>("select published_at from public.articles where id=$1",[post.id])).rows[0];
 assert.ok(retained.published_at,"publication history was cleared");
 await assert.rejects(()=>db.query("update public.articles set slug='changed-url' where id=$1",[post.id]));
 await asRole(db,"anon");
 assert.equal((await db.query("select id from public.articles")).rows.length,0,"unpublished post leaked");
 await db.close();
});
