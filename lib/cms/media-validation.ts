import { safeUrl } from "./rich-text";
const managedMedia = /^\/api\/editorial\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const legacyMedia = /^\/api\/gallery\/legacy\/gallery\.image\.\d+$/;
export function isManagedMediaUrl(value:string){return managedMedia.test(value)||legacyMedia.test(value);}
export function validateManagedMediaUrl(value:unknown){
 if(typeof value!=="string"||!safeUrl(value)||!isManagedMediaUrl(value))throw new Error("Upload an image through the ALS media library.");
 return value;
}
