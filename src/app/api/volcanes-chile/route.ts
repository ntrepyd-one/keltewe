import { NextResponse } from 'next/server';
const VOLCANES = [
  { id:'villarrica', name:'Villarrica', lat:-39.42, lng:-71.93, alert:'green', altitude:2847, region:'Araucania' },
  { id:'calbuco', name:'Calbuco', lat:-41.33, lng:-72.61, alert:'green', altitude:2003, region:'Los Lagos' },
  { id:'lascar', name:'Lascar', lat:-23.37, lng:-67.73, alert:'yellow', altitude:5592, region:'Antofagasta' },
  { id:'puyehue', name:'Puyehue-Cordon Caulle', lat:-40.59, lng:-72.12, alert:'yellow', altitude:2236, region:'Los Rios' },
  { id:'nevados-chillan', name:'Nevados de Chillan', lat:-36.86, lng:-71.38, alert:'green', altitude:3212, region:'Nuble' },
  { id:'copahue', name:'Copahue', lat:-37.86, lng:-71.17, alert:'green', altitude:2965, region:'Biobio' },
  { id:'hudson', name:'Hudson', lat:-45.90, lng:-72.97, alert:'green', altitude:1905, region:'Aysen' },
  { id:'chaiten', name:'Chaiten', lat:-42.83, lng:-72.65, alert:'green', altitude:1122, region:'Los Lagos' },
  { id:'llaima', name:'Llaima', lat:-38.69, lng:-71.73, alert:'green', altitude:3125, region:'Araucania' },
  { id:'osorno', name:'Osorno', lat:-41.10, lng:-72.49, alert:'green', altitude:2652, region:'Los Lagos' },
  { id:'isluga', name:'Isluga', lat:-19.15, lng:-68.83, alert:'green', altitude:5530, region:'Tarapaca' },
  { id:'san-pedro', name:'San Pedro', lat:-21.88, lng:-68.40, alert:'green', altitude:6145, region:'Antofagasta' },
  { id:'lonquimay', name:'Lonquimay', lat:-38.38, lng:-71.58, alert:'green', altitude:2865, region:'Araucania' },
  { id:'villarrica2', name:'Mocho-Choshuenco', lat:-39.92, lng:-72.03, alert:'green', altitude:2422, region:'Los Rios' },
];
export async function GET() {
  return NextResponse.json({ volcanes: VOLCANES, total: VOLCANES.length, timestamp: new Date().toISOString(), source: 'Sernageomin RNVV' }, { headers: { 'Cache-Control': 'public, s-maxage=3600' } });
}
