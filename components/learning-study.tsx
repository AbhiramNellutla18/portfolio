'use client';

import { useId, useState } from 'react';
import styles from './ml-studies.module.css';

const samples = Array.from({ length: 39 }, (_, i) => ({
  x: 5 + ((i * 37) % 91),
  y: 7 + ((i * 23 + i * i * 3) % 86),
}));
const probe = { x: 60, y: 45 };
const points = [...samples, probe];
const score = (point: typeof probe) => point.y + .55 * point.x;
const plotX = (x: number) => 22 + 3.92 * x;
const plotY = (y: number) => 192 - 1.74 * y;

export default function LearningStudy() {
  const [threshold, setThreshold] = useState(72);
  const id = useId();
  const countA = points.filter(point => score(point) >= threshold).length;
  const probeClass = score(probe) >= threshold ? 'A' : 'B';
  const left = plotY(threshold);
  const right = plotY(threshold - 55);

  return <div className={`learning-study ${styles.classifier}`}>
    <div className="study-heading"><span>FIELD NOTES / 001</span><span>CLASSIFICATION</span></div>
    <h3>One boundary.<br/><em>Two classes.</em></h3>
    <div className={styles.plot}>
      <svg viewBox="0 0 436 208" role="img"
        aria-label={`Linear classifier with 40 synthetic points. ${countA} are in class A and ${points.length-countA} in class B. The ringed point is in class ${probeClass}.`}>
        <defs>
          <pattern id={id+'-dots'} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r=".8" fill="#997f70" opacity=".34"/>
          </pattern>
          <clipPath id={id+'-plot'}><rect x="22" y="18" width="392" height="174" rx="6"/></clipPath>
        </defs>
        <g clipPath={`url(#${id}-plot)`}>
          <rect x="22" y="18" width="392" height="174" fill="#ecf5ed"/>
          <path d={`M22 -100 H414 V${right} L22 ${left} Z`} fill="#ffe4cf"/>
          <rect x="22" y="18" width="392" height="174" fill={`url(#${id}-dots)`}/>
          <line x1="22" y1={left} x2="414" y2={right} stroke="#896a5a" strokeWidth="1.7" strokeDasharray="5 4"/>
          {points.map((point, i) => <circle key={i} cx={plotX(point.x)} cy={plotY(point.y)}
            r={i === points.length - 1 ? 5.5 : 4} fill={score(point) >= threshold ? '#b55339' : '#38796e'}
            stroke="#fffdf7" strokeWidth="1.3"/>)}
          <circle cx={plotX(probe.x)} cy={plotY(probe.y)} r="10" stroke="#302b2a" strokeWidth="1.8" fill="none"/>
        </g>
      </svg>
    </div>
    <div className={styles.legend} aria-hidden="true">
      <span><i className={styles.dotA}/>Class A <b>{countA}</b></span>
      <span><i className={styles.dotB}/>Class B <b>{points.length-countA}</b></span>
    </div>
    <div className="study-controls">
      <label htmlFor={id+'-threshold'}>Move the boundary</label>
      <output htmlFor={id+'-threshold'} className={styles.probe}>Ringed point <strong>→ {probeClass}</strong></output>
      <input id={id+'-threshold'} type="range" min="15" max="140" value={threshold}
        aria-describedby={id+'-guide'} aria-valuetext={`Threshold ${threshold}. Ringed point is in class ${probeClass}.`}
        onChange={event => setThreshold(Number(event.target.value))}/>
    </div>
    <p id={id+'-guide'}>40 synthetic samples. Slide the line across the ringed point to change its predicted class.</p>
  </div>;
}
