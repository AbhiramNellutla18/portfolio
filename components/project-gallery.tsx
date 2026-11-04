'use client';

import { useState } from 'react';

import { ArrowUpRight, X } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { projects } from '@/data/projects';
import ProjectVisual from './project-visual';

const categories = ['All', ...new Set(projects.map(project => project.category))];

export default function ProjectGallery() {
  const [filter, setFilter] = useState('All');
  const reduce = useReducedMotion();
  const visible = projects.filter(project =>
    filter === 'All' || project.category === filter || project.stack.includes(filter)
  );

  return <>
    <div className="project-tools">
      <div className="filters" role="group" aria-label="Filter projects">
        {categories.map(category => <button key={category} aria-pressed={filter === category}
          className={filter === category ? 'selected' : ''} onClick={() => setFilter(category)}>
          {category}{category === 'All' && <span>{projects.length.toString().padStart(2,'0')}</span>}
        </button>)}
        {!categories.includes(filter) && <button className="tag-reset" onClick={() => setFilter('All')} aria-label={`Clear ${filter} filter`}>{filter}<X size={13}/></button>}
      </div>
      <span className="collection-count" role="status">{visible.length} {visible.length === 1 ? 'study' : 'studies'}</span>
    </div>
    <div className="project-grid">
      {visible.map(project => {
        const url = `/projects/${project.slug}/`;
        return <article key={project.slug} className={`project-card ${project.slug === 'aavarta' ? 'featured' : ''}`}>
          <a href={url} className="project-image-link" aria-label={`Read ${project.title} case study`}
            onPointerMove={event => {
              if (reduce || event.pointerType !== 'mouse') return;
              const box = event.currentTarget.getBoundingClientRect();
              const tiltX = (event.clientY - box.top - box.height / 2) / -150;
              const tiltY = (event.clientX - box.left - box.width / 2) / 180;
              event.currentTarget.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            }}
            onPointerLeave={event => { event.currentTarget.style.transform = ''; }}>
            <ProjectVisual theme={project.theme}/><span className="project-open"><ArrowUpRight size={22}/></span>
          </a>
          <div className="project-meta"><span>{project.category.toUpperCase()}</span>
            <span>STUDY {String(projects.indexOf(project)+1).padStart(2,'0')}</span></div>
          <a href={url} className="project-title"><h3>{project.title}</h3><ArrowUpRight size={22}/></a>
          <p>{project.description}</p>
          <div className="project-tags">{project.stack.slice(0,3).map(tool =>
            <button key={tool} onClick={() => setFilter(tool)} aria-label={`Filter by ${tool}`}>{tool}</button>
          )}</div>
          <small className="project-status">{project.status}</small>
        </article>;
      })}
    </div>
  </>;
}
