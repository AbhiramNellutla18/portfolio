'use client';

import { useState, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ProjectTheme } from '@/data/projects';
import './project-visual.css';

type PreviewProps = { interactive: boolean };

function Figure({ theme, label, title, detail, children, action }: {
  theme: ProjectTheme;
  label: string;
  title: string;
  detail: string;
  children: ReactNode;
  action?: { label: string; run: () => void };
}) {
  return <div className={`project-art project-print ${theme}${action ? ' is-interactive' : ''}`}>
    <div className="print-top"><span>{label}</span><span aria-hidden="true">FIG. 01</span></div>
    <div className="print-canvas">{children}</div>
    <div className="print-foot">
      <div aria-live={action ? 'polite' : undefined}>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
      {action && <button type="button" className="print-action" onClick={action.run}>
        {action.label}<ArrowRight size={14} aria-hidden="true"/>
      </button>}
    </div>
  </div>;
}

function Plot({ label, children }: { label: string; children: ReactNode }) {
  return <svg className="print-plot" viewBox="0 0 520 218" role="img" aria-label={label}>
    {children}
  </svg>;
}

const currents = Array.from({ length: 16 }, (_, i) => {
  const y = i * 18 - 31;
  return `M-16 ${y} C78 ${y+12} 131 ${y+65} 205 ${y+29} S305 ${y-36} 381 ${y+4} S468 ${y+55} 540 ${y+17}`;
});
const coastline = 'M405-10 400 14 420 28 409 44 438 66 430 80 449 95 438 107 451 121 451 140 469 147 463 161 480 174 477 196 497 209 491 228H540V-10Z';

function OceanVisual({ interactive }: PreviewProps) {
  const [drift, setDrift] = useState(false);
  return <Figure theme="ocean" label="AAVARTA / OCEAN SURVEY"
    title={drift ? 'Follow a floating sample' : 'Find a survey area'}
    detail={drift ? 'Three illustrative positions along a drift path.' : 'Layer 01 · illustrative accumulation zones'}
    action={interactive ? { label: drift ? 'Show accumulation' : 'Trace drift', run: () => setDrift(!drift) } : undefined}>
    <Plot label={drift ? 'A sample trajectory runs from west to east over the current field.' : 'Current lines converge into two highlighted zones offshore.'}>
      <defs><clipPath id="survey-map-bounds"><rect x="10" y="4" width="500" height="210" rx="12"/></clipPath></defs>
      <g clipPath="url(#survey-map-bounds)">
      <rect x="10" y="4" width="500" height="210" fill="#a7dfdb"/>
      <g fill="none" stroke="#379a9d">{currents.map((d, i) =>
        <path key={i} d={d} opacity={i % 4 === 0 ? .9 : .4} strokeWidth={i % 4 === 0 ? 1.7 : 1}/>
      )}</g>
      <path d={coastline} fill="#dfe8c2" stroke="#76aca1" strokeWidth="1.5"/>
      {drift ? <g>
        <path d="M65 154C125 154 140 169 189 136S236 79 288 81 344 128 396 107" fill="none" stroke="#fff5d7" strokeWidth="6"/>
        <path className="drift-ink" d="M65 154C125 154 140 169 189 136S236 79 288 81 344 128 396 107" fill="none" stroke="#9f4937" strokeWidth="2.3" strokeDasharray="6 4"/>
        {[[65,154,'START'],[230,101,'DRIFT'],[396,107,'LATER']].map(([x,y,text])=>
          <g key={text} transform={`translate(${x} ${y})`}><circle r="5" fill="#fcf2d0" stroke="#95442f" strokeWidth="2"/><text y="-13" textAnchor="middle" className="plot-label">{text}</text></g>)}
      </g> : <g>
        {[[202,121,1],[324,90,.47]].map(([x,y,s])=><g key={x} transform={`translate(${x} ${y}) rotate(-24) scale(${s})`}>
          <ellipse rx="63" ry="31" fill="#ffd678" fillOpacity=".46" stroke="#fff4c0"/>
          <ellipse rx="43" ry="22" fill="#ffb581" fillOpacity=".70" stroke="#ffe4a1"/>
          <ellipse rx="21" ry="11" fill="#ed916d" stroke="#ffce9a"/>
        </g>)}
        <path d="m201 121 29-46h79" className="plot-leader"/><text x="236" y="68" className="plot-label">SURVEY AREA</text>
      </g>}
      </g>
      <rect x="10" y="4" width="500" height="210" rx="12" fill="none" stroke="#eff9e7" strokeWidth="1.2"/>
    </Plot>
  </Figure>;
}

const responseStages = [
  { title: 'Review the evidence', detail: 'A simulated detection is waiting for a decision.', action: 'Approve event', label: 'REVIEW', next: 'Pending' },
  { title: 'Contain the session', detail: 'Approval applies a temporary rule to this session.', action: 'Simulate expiry', label: 'APPROVED', next: 'Contained' },
  { title: 'Release the rule', detail: 'At expiry, the simulated containment is rolled back.', action: 'Reset example', label: 'EXPIRED', next: 'Released' },
];

function SecurityVisual({ interactive }: PreviewProps) {
  const [index, setIndex] = useState(0);
  const stage = responseStages[index];
  return <Figure theme="security" label="KAVACHA / RESPONSE CONTROL" title={stage.title} detail={stage.detail}
    action={interactive ? { label: stage.action, run: () => setIndex((index+1) % responseStages.length) } : undefined}>
    <Plot label={`A simulated event passes through approval. Current state: ${stage.next}.`}>
      <g fill="none" stroke="#659783"><circle cx="261" cy="107" r="73" strokeDasharray="2 6"/><circle cx="261" cy="107" r="58" opacity=".6"/></g>
      <path d="M104 130 156 130 180 106H216m92 0h31l28-28h52" fill="none" stroke="#709783" strokeWidth="2"/>
      <g fill="#fff8e3" stroke="#719785" strokeWidth="1.5"><rect x="38" y="112" width="88" height="37" rx="8"/><rect x="384" y="60" width="103" height="37" rx="8"/></g>
      <text x="82" y="135" textAnchor="middle" className="plot-label">EVENT 01</text>
      <text x="436" y="83" textAnchor="middle" className="plot-label">{stage.next.toUpperCase()}</text>
      <path d="m261 59 40 16v31q-1 30-40 48-40-18-40-48V75Z" fill={index===1?'#b3dfbd':'#fff5d8'} stroke="#4f7660" strokeWidth="2.5"/>
      {index===1 ? <path d="m242 106 12 12 23-28" fill="none" stroke="#427752" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        : <g fill="none" stroke="#74967d" strokeWidth="2"><path d="M241 111q20-27 40 0-20 20-40 0Z"/><circle cx="261" cy="109" r="6"/></g>}
      <text x="261" y="194" textAnchor="middle" className="plot-label">{stage.label}</text>
    </Plot>
  </Figure>;
}

// The illustrative site center is (0°, 0°).
function distanceMetres(latitude: number, longitude: number) {
  const radians = Math.PI / 180;
  const a = Math.sin(latitude * radians / 2) ** 2 + Math.cos(latitude*radians) * Math.sin(longitude * radians / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function AttendanceVisual({ interactive }: PreviewProps) {
  const [away, setAway] = useState(false);
  const radius = 100;
  const distance = Math.round(distanceMetres(away ? .00135 : .00048, 0));
  const inside = distance <= radius;
  const position = 243 + distance * .72;
  return <Figure theme="attendance" label="PRESENCE / GEOFENCE CHECK"
    title={inside ? 'Inside the authorized area' : 'Outside the authorized area'}
    detail={`Synthetic location · ${distance} m from center · radius ${radius} m`}
    action={interactive ? { label: inside ? 'Move outside' : 'Move inside', run: () => setAway(!away) } : undefined}>
    <Plot label={`A simulated identity match at a distance of ${distance} metres from the center of a 100 metre geofence.`}>
      <g fill="#fff7e3" opacity=".73" stroke="#d9ab9e" strokeWidth="1" transform="rotate(-17 260 109)">
        {[0,1,2,3].flatMap(row=>[0,1,2,3,4,5,6].map(col=><rect key={`${row}-${col}`} x={col*85-20} y={row*73-20} width="65" height="52" rx="10"/>))}
      </g>
      <circle cx="243" cy="109" r="72" fill="#c6b7ea" fillOpacity=".37" stroke="#79658f" strokeWidth="2" strokeDasharray="7 5"/>
      <circle cx="243" cy="109" r="4" fill="#776187"/>
      <path d={`M243 109h${distance*.72}`} stroke="#79658f" strokeWidth="2"/>
      <g transform={`translate(${position} 109)`}><path d="M0 0q-15-16-15-25a15 15 0 1 1 30 0Q15-16 0 0Z" fill="#bd624b" stroke="#fff6df" strokeWidth="2"/><circle cy="-25" r="5" fill="#fff6df"/></g>
      <text x="243" y="201" textAnchor="middle" className="plot-label">SITE RADIUS / 100 M</text>
    </Plot>
  </Figure>;
}

const sampleAges = [21, 22, 26, 31, 33, 34, 38, 41, 42, 45, 46, 48, 51, 53, 54, 57, 62, 65, 67, 73];
const bins = [20,30,40,50,60,70];

function HealthVisual({ interactive }: PreviewProps) {
  const [older, setOlder] = useState(false);
  const ages = older ? sampleAges.filter(age => age >= 40) : sampleAges;
  return <Figure theme="health" label="HEALTHGRID / COHORT EXPLORER"
    title={`${ages.length} synthetic records`} detail={older ? 'Age filter · 40 and over' : 'Age distribution · all demonstration records'}
    action={interactive ? { label: older ? 'Show all ages' : 'Filter age ≥ 40', run: () => setOlder(!older) } : undefined}>
    <Plot label={`Histogram of ${ages.length} invented ages, grouped by decade.`}>
      <rect x="35" y="15" width="450" height="188" rx="15" fill="#fffdf7" fillOpacity=".9" stroke="#fff"/>
      <text x="58" y="40" className="plot-label">AGE DISTRIBUTION</text>
      {[0,2,4].map(n=><g key={n}><path d={`M78 ${164-n*19}h377`} stroke="#c7c8d9" strokeDasharray="3 4"/><text x="61" y={168-n*19} className="plot-label">{n}</text></g>)}
      {bins.map((start,i)=>{
        const count = ages.filter(age=>age>=start && age<start+10).length;
        return <g key={start}><rect x={91+61*i} y={164-count*19} width="37" height={count*19} rx="5" fill={i%2?'#91b5cd':'#aa9acf'}/><text x={109+61*i} y="186" textAnchor="middle" className="plot-label">{start}s</text></g>;
      })}
    </Plot>
  </Figure>;
}

function VaultVisual({ interactive }: PreviewProps) {
  const [second, setSecond] = useState(false);
  const original = ['A','B','C'];
  const later = ['A','D','C'];
  const stored = [...new Set(second ? [...original,...later] : original)];
  const tones: Record<string,string> = { A:'#d6c5f3', B:'#bfdcd4', C:'#f3c9b0', D:'#f1d98e' };
  return <Figure theme="vault" label="BROKENVAULT / CHUNK STORE"
    title={second ? 'Two snapshots share their chunks' : 'One snapshot, three chunks'}
    detail={second ? `6 references · ${stored.length} unique chunks · A and C reused` : 'Illustrative snapshot · chunks A, B and C'}
    action={interactive ? { label: second ? 'Reset store' : 'Add snapshot 02', run: () => setSecond(!second) } : undefined}>
    <Plot label={second ? 'Snapshots ABC and ADC share A and C, producing four unique stored chunks.' : 'Snapshot ABC references three unique chunks in storage.'}>
      {[original, ...(second ? [later] : [])].map((snapshot,i)=><g key={i} transform={`translate(${i*185} 0)`}>
        <rect x={second?85:174} y="26" width="161" height="66" rx="10" fill="#fff9ef" stroke="#fff"/>
        <text x={second?97:186} y="46" className="plot-label">SNAPSHOT 0{i+1}</text>
        {snapshot.map((chunk,j)=><g key={j}><rect x={(second?97:186)+j*47} y="56" width="39" height="24" rx="4" fill={tones[chunk]}/><text x={(second?116:205)+j*47} y="72" textAnchor="middle" className="plot-label">{chunk}</text></g>)}
      </g>)}
      <path d={second?'M164 92v20h185V92m-92 20v14':'M254 92v35'} fill="none" stroke="#90809f" strokeWidth="2"/>
      <rect x="87" y="127" width="346" height="63" rx="10" fill="#f4eefb" stroke="#b3a2c1"/>
      <text x="105" y="163" className="plot-label">CHUNK STORE</text>
      {stored.map((chunk,i)=><g key={chunk}><rect x={211+i*51} y="141" width="39" height="33" rx="5" fill={tones[chunk]} stroke="#fff8"/><text x={230+i*51} y="162" textAnchor="middle" className="plot-label">{chunk}</text></g>)}
    </Plot>
  </Figure>;
}

const visuals = { ocean: OceanVisual, security: SecurityVisual, attendance: AttendanceVisual, health: HealthVisual, vault: VaultVisual };

export default function ProjectVisual({ theme, interactive = false }: { theme: ProjectTheme; interactive?: boolean }) {
  const Visual = visuals[theme];
  return <Visual interactive={interactive}/>;
}
