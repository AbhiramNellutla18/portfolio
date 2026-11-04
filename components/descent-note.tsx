'use client';

import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

// For L(w) = (w − 2)², the slope is 2(w − 2). Take six steps with η = 0.15.
const weights = [-1];
for (let step = 0; step < 6; step++) {
  const weight = weights[step];
  weights.push(weight - .15 * 2 * (weight - 2));
}
const loss = (weight: number) => (weight - 2) ** 2;
const x = (weight: number) => 22 + (weight + 1.4) * 55;
const y = (weight: number) => 102 - loss(weight) * 7.2;
const curve = Array.from({ length: 81 }, (_, index) => {
  const weight = -1.4 + index * .085;
  return `${x(weight)},${y(weight)}`;
}).join(' ');

export default function DescentNote() {
  const [step, setStep] = useState(0);
  const last = step === weights.length - 1;
  const weight = weights[step];

  return <figure className="descent-note" id="descent">
    <figcaption><span className="note-kicker">FIELD NOTES / 002</span><h3>A step downhill</h3></figcaption>
    <p>Here the target weight is 2. Loss measures the squared distance to that target. Take a step along the slope and watch the loss fall.</p>
    <svg viewBox="0 0 420 124" role="img" aria-label={`Quadratic loss curve. Weight ${weight.toFixed(2)}, loss ${loss(weight).toFixed(2)}.`}>
      <g stroke="#a7bfb2" strokeWidth=".8" strokeDasharray="3 5">
        {[40, 70, 102].map(line => <path key={line} d={`M16 ${line} H405`}/>)}
      </g>
      <polygon points={`${x(-1.4)},102 ${curve} ${x(5.4)},102`} fill="#d5e8d9" opacity=".56"/>
      <polyline points={curve} fill="none" stroke="#537968" strokeWidth="2"/>
      {weights.slice(0,step).map(value => <circle key={value} cx={x(value)} cy={y(value)} r="3" fill="#b77c68"/>)}
      <circle cx={x(weight)} cy={y(weight)} r="10" fill="#f39874" opacity=".32"/>
      <circle cx={x(weight)} cy={y(weight)} r="5" fill="#ad4730" stroke="white" strokeWidth="2"/>
      <text x="17" y="119">WEIGHT →</text><text x="315" y="119">L = (w − 2)²</text>
    </svg>
    <div className="descent-controls"><output aria-live="polite">Step {step} · Loss <strong>{loss(weight).toFixed(2)}</strong></output>
      <button onClick={() => setStep(last ? 0 : step + 1)} type="button">
        {last ? 'Start again' : 'Take a step'} {last ? <RotateCcw size={14}/> : <ArrowRight size={14}/>}
      </button>
    </div>
  </figure>;
}
