import { earlyTeamPeriods, teamYears } from "@/data/team";
export const teamPhotoRecords = [
 ...teamYears.flatMap(year=>year.members.filter(m=>!m.isPlaceholder).map(m=>({id:m.id,year:year.year,name:m.name,role:m.role,group:m.group}))),
 ...earlyTeamPeriods.flatMap(period=>period.members.map((m,index)=>({id:"archive-"+period.period.replace("/","-")+"-"+index,year:period.period,name:m.name,role:m.role,group:"Board"}))),
];
export function isTeamRecord(key:string){return teamPhotoRecords.some(m=>m.id===key);}
