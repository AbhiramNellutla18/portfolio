'use client';

import { useId, useState } from 'react';
import styles from './ml-studies.module.css';

// One foreground channel. Valid 3 × 3 filtering with stride 1 yields a 5 × 5 map.
const glyph = [
  '0000000', '0111110', '0110000', '0111100', '0110000', '0110000', '0000000',
].map(row => Array.from(row, Number));
const filters = [
  { name: 'Vertical edges', weights: [-1, 0, 1, -2, 0, 2, -1, 0, 1] },
  { name: 'Horizontal edges', weights: [-1, -2, -1, 0, 0, 0, 1, 2, 1] },
];
const responses = filters.map(({ weights }) =>
  Array.from({ length: 25 }, (_, cell) => {
    const row = Math.floor(cell / 5);
    const col = cell % 5;
    const sum = weights.reduce((value, weight, i) =>
      value + weight * glyph[row + Math.floor(i / 3)][col + i % 3], 0);
    return Math.max(0, sum);
  })
);

function PixelTile({ values, size, response = false }: { values: number[]; size: number; response?: boolean }) {
  const inks = response ? ['#faf0e7', '#ffd7bc', '#f7ab82', '#e78057', '#b84d30'] : ['#e5ede8', '#386c62'];
  return <svg viewBox={`0 0 ${size*10} ${size*10}`} aria-hidden="true">
    {values.map((value, i) => <rect key={i} x={i % size * 10 + .5} y={Math.floor(i / size) * 10 + .5}
      width="9" height="9" rx="1" fill={inks[value]}/>)}
  </svg>;
}

export default function FeatureStudy() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const result = responses[selected];
  const activated = result.filter(value => value > 0).length;

  return <section className={styles.feature} aria-labelledby={id}>
    <div className={styles.featureHeader}><span>FIELD NOTES / 003</span><span>VISION</span></div>
    <h3 id={id}>What does a filter see?</h3>
    <p>A convolutional network builds features from small patches of pixels. Try two edge filters on the same letter.</p>
    <div className={styles.filterSet} role="group" aria-label="Choose an edge filter">
      {filters.map((filter, i) => <button key={filter.name} type="button" aria-pressed={selected===i}
        onClick={() => setSelected(i)}>{filter.name}</button>)}
    </div>
    <div className={styles.tiles} aria-hidden="true">
      <div><PixelTile values={glyph.flat()} size={7}/><small>Input · 7×7</small></div>
      <span>→</span>
      <div>
        <div className={styles.kernel}>{filters[selected].weights.map((w, i) =>
          <b key={i} data-sign={Math.sign(w)}>{w}</b>)}</div>
        <small>Kernel · 3×3</small>
      </div>
      <span>→</span>
      <div><PixelTile values={result} size={5} response/><small>Output · 5×5</small></div>
    </div>
    <p className={styles.featureResult} aria-live="polite">ReLU keeps the positive responses. <b>{activated} of 25</b> patches activate with the {selected === 0 ? 'vertical' : 'horizontal'} filter. Deeper coral means a stronger response.</p>
  </section>;
}
