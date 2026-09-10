"use client";
/* eslint-disable @next/next/no-img-element -- Permission-checked media and original portrait proportions. */
import {useState} from "react";
import {useTeamPhoto} from "./TeamPhotoProvider";
import {cn} from "@/lib/utils";
export function initials(name:string){return name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(part=>Array.from(part)[0]?.toUpperCase()).join("");}
export function MemberAvatar({id,name,image="",large=false,compact=false}:{id:string;name:string;image?:string;large?:boolean;compact?:boolean}){
 const src=useTeamPhoto(id,image);const [failedSrc,setFailedSrc]=useState("");
 return <div className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-lg border border-als-line bg-als-blue-soft",compact?"h-14 w-14":large?"h-80 md:h-full md:min-h-80":"h-48")}>
  {src&&failedSrc!==src?<img key={src} src={src} alt={name} onError={()=>setFailedSrc(src)} className="absolute inset-0 h-full w-full object-contain" loading="lazy"/>:
  <span aria-label={name} className={cn("grid place-items-center rounded-full bg-white font-bold text-als-blue ring-1 ring-als-line",compact?"h-10 w-10 text-sm":large?"h-24 w-24 text-3xl":"h-20 w-20 text-2xl")}>{initials(name)}</span>}
 </div>;
}
