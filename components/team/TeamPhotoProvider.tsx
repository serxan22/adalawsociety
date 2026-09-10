"use client";
import {createContext,useContext,useEffect,useState,type ReactNode} from "react";
const PhotoContext=createContext<Record<string,string|null>>({});
export function TeamPhotoProvider({children}:{children:ReactNode}){
 const [photos,setPhotos]=useState<Record<string,string|null>>({});
 useEffect(()=>{
  const controller=new AbortController();
  const refresh=()=>fetch("/api/team/photos",{cache:"no-store",signal:controller.signal}).then(async r=>{if(r.ok)setPhotos((await r.json()).photos);}).catch(()=>{});
  void refresh();window.addEventListener("focus",refresh);window.addEventListener("als-team-photo-change",refresh);
  return()=>{controller.abort();window.removeEventListener("focus",refresh);window.removeEventListener("als-team-photo-change",refresh);};
 },[]);
 return <PhotoContext.Provider value={photos}>{children}</PhotoContext.Provider>;
}
export function useTeamPhoto(id:string,fallback=""){const photos=useContext(PhotoContext);return id in photos?photos[id]??"":fallback;}
