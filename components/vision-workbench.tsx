'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const scene = '/images/studio-workbench.webp';
const layers = [[60, 100, 140], [40, 80, 120, 160], [60, 100, 140]];
const syntax = [96, 64, 116, 82, 103];

function NetworkDisplay() {
  return <g transform="matrix(1 -.139 .011 1 336 163)" clipPath="url(#studio-left-screen)">
    <text x="9" y="23" className="studio-display-title">FORWARD PASS</text>
    <path d="M8 33h276" stroke="#d1c6b2" strokeWidth="2"/>
    <g transform="translate(8 8)">
      {layers.slice(0, -1).map((nodes, layer) =>
        <g key={layer} className={layer === 0 ? 'studio-input-links' : 'studio-output-links'}>
          {nodes.flatMap(y => layers[layer + 1].map(nextY => {
            const edge = `M${22 + layer * 110} ${y}l110 ${nextY - y}`;
            return <g key={`${y}-${nextY}`} fill="none">
              <path d={edge} stroke="#8eaaa0" strokeWidth="2" opacity=".65"/>
              <path className="studio-flow" d={edge} pathLength="1" strokeWidth="3.2"/>
            </g>;
          }))}
        </g>
      )}
      {layers.map((ys, layer) => ys.map(y =>
        <circle key={layer+'-'+y} cx={22+layer*110} cy={y} r="7.5"
          fill={['#cc8167','#ad99bd','#558e80'][layer]} stroke="#fff7e8" strokeWidth="1.5"/>
      ))}
    </g>
  </g>;
}

function TrainingDisplay() {
  return <g clipPath="url(#studio-right-screen)">
    <g transform="matrix(1 -.085 0 1 671 128)">
      <text x="10" y="19" className="studio-display-title">TRAIN.PY</text>
      <path d="M10 31h248" stroke="#d1c6b2" strokeWidth="2"/>
      {syntax.map((width, row) =>
        <g key={row} transform={`translate(${row%3 === 0 ? 11 : 27} ${47+row*18})`}>
          <rect width="17" height="4" rx="2" fill="#bd705c"/>
          <path className="studio-source" d={`M24 2h${width}`} pathLength="1"
            stroke={row%2 ? '#6f9185' : '#9d8aa9'} strokeWidth="4" strokeLinecap="round"
            style={{animationDelay:`${row * -.64}s`}}/>
        </g>
      )}
      <path d="M10 143v26h150" stroke="#c3b6a3" strokeWidth="2" fill="none"/>
      <path d="m15 145 13 3 10-2 16 6 15-1 13 6 17-2 15 5 18-1 18 4" stroke="#578779" strokeWidth="3" fill="none"/>
    </g>
  </g>;
}

export default function VisionWorkbench() {
  const artwork = useRef<SVGSVGElement>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const enabled = choice ?? autoPlay;
  const moving = enabled && inView;

  useEffect(() => {
    const node = artwork.current;
    if (!node) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setAutoPlay(!preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(node);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updatePreference);
    };
  }, []);
  return <figure className="studio-diorama" data-motion={moving ? 'on' : 'off'}>
    <svg ref={artwork} viewBox="0 0 1536 1024" role="img"
      aria-label="A developer at a maple desk watches signals travel from input nodes through a hidden layer to output nodes.">
      <defs>
        <clipPath id="studio-left-screen"><rect width="295" height="197" rx="2"/></clipPath>
        {/* The outline follows the exposed glass, including the shoulder in front of it. */}
        <clipPath id="studio-right-screen"><path d="M668 121 850 107 868 139 879 163 886 195 910 231 892 260 846 284 823 300 669 316Z"/></clipPath>
      </defs>
      <image href={scene} width="1536" height="1024"/>
      <NetworkDisplay/>
      <TrainingDisplay/>
    </svg>
    <figcaption>
      <span>STUDIO NOTES <span aria-hidden="true">/</span> INPUT → HIDDEN → OUTPUT</span>
      <button type="button" aria-label={enabled ? 'Pause studio animation' : 'Play studio animation'}
        onClick={() => setChoice(!enabled)}>{enabled ? <Pause size={14}/> : <Play size={14}/>}</button>
    </figcaption>
  </figure>;
}
