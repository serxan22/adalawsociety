import test from "node:test";
import assert from "node:assert/strict";
import {slugify} from "../lib/cms/slug";
import {hasMeaningfulRichText,isRichTextDocument,safeUrl} from "../lib/cms/rich-text";
import {gallerySchema} from "../lib/cms/gallery-validation";
import {publicOverrides} from "../lib/content/public-overrides";
import {articles} from "../data/articles";
import {newsItems} from "../data/news";
import {authorSchema, categorySchema} from "../lib/cms/validation";
test("imported profiles remain editable without fabricated optional information",()=>{
 const author=authorSchema.parse({full_name:"İnci Açak",bio:null,position:null,avatar_url:null,social_links:{},user_id:null});
 assert.equal(author.bio,null);assert.equal(author.position,null);
 assert.equal(authorSchema.parse({full_name:"İnji Achak",bio:"",position:""}).bio,null);
 assert.equal(categorySchema.parse({name:"Legal Articles",slug:"legal-articles",description:null}).description,null);
});
test("CMS validation rejects unsafe URLs and malformed rich text",()=>{
 assert.equal(slugify("Annual Community Meeting 2026"),"annual-community-meeting-2026");
 assert.equal(safeUrl("javascript:alert(1)"),false);
 assert.equal(safeUrl("/api/editorial/media/10000000-0000-4000-8000-000000000001"),true);
 const doc={type:"doc" as const,content:[{type:"paragraph",content:[{type:"text",text:"A real article"}]}]};
 assert.equal(isRichTextDocument(doc),true);assert.equal(hasMeaningfulRichText(doc),true);
	 assert.equal(isRichTextDocument({type:"doc",content:[{type:"image",attrs:{src:"javascript:bad"}}]}),false);
});
test("public fallbacks stay empty and media validation accepts only managed images",()=>{
	assert.deepEqual(articles,[]);assert.deepEqual(newsItems,[]);
	assert.equal(gallerySchema.safeParse({imageUrl:"https://example.com/photo.jpg",caption:"",altText:"Photo",sortOrder:0,status:"draft"}).success,false);
	assert.equal(gallerySchema.safeParse({imageUrl:"/api/editorial/media/10000000-0000-4000-8000-000000000001",caption:"",altText:"Photo",sortOrder:0,status:"published"}).success,true);
	const overrides=publicOverrides([
		{key:"gallery.image.4",value:"/images/placeholders/gallery-4.jpg",type:"image"},
		{key:"gallery.image.4",value:"https://project.supabase.co/storage/v1/object/public/site-images/real.heic",type:"image"},
	]);
	assert.equal(overrides["gallery.image.4"].value.endsWith("real.heic"),true);
});
