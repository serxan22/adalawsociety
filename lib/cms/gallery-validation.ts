import {z} from "zod";
import {isManagedMediaUrl} from "./media-validation";
export const gallerySchema=z.object({
 imageUrl:z.string().refine(isManagedMediaUrl,"Upload an image through the ALS media library."),
 caption:z.string().trim().max(500).default(""),
 altText:z.string().trim().min(2,"Alt text is required.").max(500),
 sortOrder:z.coerce.number().int().min(-100000).max(100000).default(0),
 status:z.enum(["draft","published","unpublished"]).default("draft"),
 legacyKey:z.string().regex(/^gallery\.image\.\d+$/).nullable().optional(),
});
