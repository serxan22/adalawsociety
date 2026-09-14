"use client";
/* eslint-disable @next/next/no-img-element -- Author photos use permission-checked CMS media URLs. */
import {useState} from "react";
export function AuthorAvatar({name,image}:{name:string;image?:string}){
  const [failed,setFailed]=useState("");
  const initials=name.trim().split(/\s+/u).slice(0,2).map(part=>Array.from(part)[0]?.toLocaleUpperCase("az")).join("");
  return <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-als-line bg-als-blue-soft font-bold text-als-blue">
    {image&&failed!==image?<img src={image} alt={name} onError={()=>setFailed(image)} className="h-full w-full object-contain"/>:<span aria-label={name}>{initials}</span>}
  </span>;
}
