export type GalleryItem = {
 id:string; image_url:string; caption:string; alt_text:string;
 sort_order:number; status:"draft"|"published"|"unpublished"; updated_at:string;
 legacy_key?:string|null;
};
export type GalleryResult = {items:GalleryItem[];unavailable:boolean};
export type TeamPhoto = {member_key:string;image_url:string|null;updated_at:string};
