type ContentRow = {key:string;value:string;type:string};
// Exact retired copy only. Never reset an editor's unrelated changes.
const retired:Record<string,string[]> = {
 "home.team.text":["This section is prepared for verified ALS team information. Placeholder profiles should be replaced only with confirmed member details."],
 "competitions.noEventsText":["Add upcoming debate or moot court dates here only after ALS confirms them through its official channels."],
 "competitions.noEventsTitle":["No verified upcoming events listed yet"],
 "contact.linkPending":["Link pending"],
};
export function publicOverrides(rows:ContentRow[]) {
 return Object.fromEntries(rows.filter(row=>!retired[row.key]?.includes(row.value)).map(({key,value,type})=>[key,{value,type}]));
}
