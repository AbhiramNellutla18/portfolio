'use client';


import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ArrowDown, ArrowUpRight, Check, Command, Copy, Download, MapPin, Menu, Minus, Plus, Search, X } from 'lucide-react';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import type { Repo } from '@/lib/github';
import LearningStudy from './learning-study';
import DescentNote from './descent-note';
import FeatureStudy from './feature-study';
import VisionWorkbench from './vision-workbench';
import ProjectGallery from './project-gallery';
import GitHubExplorer from './github-explorer';

const sections = ['Home', 'About', 'Projects', 'Skills', 'Journey', 'GitHub', 'Contact'];
const specialties = ['AI & Machine Learning', 'Computer Vision', 'Full-Stack Engineering', 'Intelligent Systems', 'Creative Technology'];
const notebook = [
  { href: '#classifier', title: 'Classification', number: '01' },
  { href: '#descent', title: 'Model training', number: '02' },
  { href: '#convolution', title: 'Feature extraction', number: '03' },
];
const skillGroups = [
  { name: 'Programming languages', detail: 'Languages in my toolkit', items: ['Python', 'Java', 'TypeScript', 'C (foundations)'] },
  { name: 'AI & computer vision', detail: 'Tools and topics I’m exploring', items: ['PyTorch', 'Scikit-learn', 'Computer vision', 'Deep learning'] },
  { name: 'Frontend & backend', detail: 'Web interfaces and services', items: ['React', 'Next.js', 'Vite', 'Flask', 'HTML / CSS'] },
  { name: 'Data & geospatial', detail: 'Working with records and locations', items: ['SQLite', 'CSV', 'GPS geofencing', 'Ocean intelligence'] },
  { name: 'Systems & developer tools', detail: 'Tools behind the systems work', items: ['Git / GitHub', 'Linux security', 'Human-approved automation', 'Client–server architecture'] },
];
const chapters = [
  { label: 'STUDY', title: 'AIML at GRIET', body: 'At Gokaraju Rangaraju Institute of Engineering and Technology, I’m studying how models learn from data and how to test what they learn.', href: '#classifier', link: 'Try the classifier' },
  { label: 'EXPERIMENT', title: 'Interfaces for research', body: 'HealthGrid lets a researcher assemble a synthetic cohort and inspect its characteristics. Working with demo records makes the interface easy to explore.', href: '/projects/healthgrid/', link: 'Explore HealthGrid' },
  { label: 'COLLABORATE', title: 'Building with a team', body: 'I participated in the VNR Convergence Hackathon and worked on BrokenVault with a team. Its backup design asks how snapshots can share data safely.', href: '/projects/brokenvault/', link: 'Inside BrokenVault' },
];

function SectionLabel({ number, title, note }: { number: string; title: string; note: string }) {
  return <div className="section-label"><span>{number} / {title}</span><span>{note}</span></div>;
}

function Magnetic({ href, children }: { href: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return <a href={href} className="button primary" onPointerMove={event => {
    if (reduce || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width/2) * .08;
    const y = (event.clientY - box.top - box.height/2) * .1;
    event.currentTarget.style.transform = `translate(${x}px,${y}px)`;
  }} onPointerLeave={event => { event.currentTarget.style.transform = ''; }}>{children}</a>;
}

function Monogram() {
  return <a href="#home" className="monogram" aria-label="Abhiram Nellutla home">a<span>n</span><i/></a>;
}

export default function Portfolio({ initialRepos }: { initialRepos: Repo[] }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [mobile, setMobile] = useState(false);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('Home');
  const [specialty, setSpecialty] = useState(0);
  const [openSkill, setOpenSkill] = useState<number | null>(0);
  const [copyStatus, setCopyStatus] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setSpecialty(i => (i+1) % specialties.length), 4000);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setMobile(false);
        setPalette(value => !value);
      }
      if (event.key === 'Escape') setMobile(false);
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const current = sections.find(label => label.toLowerCase() === entry.target.id);
          if (current) setActive(current);
        }
      }
    }, { rootMargin: '-15% 0px -65% 0px' });
    for (const name of sections) {
      const section = document.getElementById(name.toLowerCase());
      if (section) observer.observe(section);
    }
    window.addEventListener('keydown', keydown);
    return () => {
      observer.disconnect();
      window.removeEventListener('keydown', keydown);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (palette) dialog.current?.showModal();
    else dialog.current?.close();
  }, [palette]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus('Email copied');
    } catch {
      setCopyStatus(`Copy this address: ${profile.email}`);
    }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyStatus(''), 4000);
  }

  const term = query.trim().toLowerCase();
  const commands = [
    ...sections.map(name => ({ name, group: 'Section', href: '#'+name.toLowerCase() })),
    ...projects.map(p => ({ name: p.title, group: 'Case study', href: `/projects/${p.slug}/` })),
    ...notebook.map(n => ({ name: n.title, group: 'Experiment', href: n.href })),
  ].filter(item => item.name.toLowerCase().includes(term));

  return <>
    <motion.div className="scroll-progress" aria-hidden="true" style={{ scaleX: reduce ? scrollYProgress : progress }}/>
    <header className="nav-shell">
      <nav aria-label="Main navigation" className="nav">
        <Monogram/>
        <div id="section-menu" className={`nav-links ${mobile ? 'is-open' : ''}`}>
          {sections.map(s => <a key={s} href={'#'+s.toLowerCase()} className={active===s ? 'active' : ''}
            aria-current={active===s ? 'location' : undefined} onClick={() => setMobile(false)}>{s}</a>)}
        </div>
        <div className="nav-actions">
          <button className="command-button" aria-label="Open command palette" onClick={() => setPalette(true)}><Command size={14}/><span>K</span></button>
          <a className="nav-contact" href="#contact" onClick={() => setMobile(false)}>Let’s talk <ArrowUpRight size={15}/></a>
          <button className="mobile-toggle" aria-label={mobile?'Close menu':'Open menu'} aria-controls="section-menu" aria-expanded={mobile} onClick={() => setMobile(!mobile)}>
            {mobile ? <X/> : <Menu/>}
          </button>
        </div>
      </nav>
    </header>
    <main id="main">
      <section className="hero" id="home">
        <div className="hero-topline"><span>THE CREATIVE ENGINEER</span><span className="location"><MapPin size={12}/> HYDERABAD, INDIA</span></div>
        <div className="hero-composition">
          <div className="hero-copy">
            <p className="eyebrow">AIML STUDENT <span aria-hidden="true">/</span> GRIET</p>
            <h1>ABHIRAM<br/><span>NELLUTLA<span className="period">.</span></span></h1>
            <h2>I build intelligence<br/>into <em>ideas.</em></h2>
            <p className="hero-description">I study Artificial Intelligence and Machine Learning at GRIET in Hyderabad. My projects explore what software can learn from an image, a location, or a signal.</p>
            <div className="hero-buttons"><Magnetic href="#projects">Explore my work <ArrowUpRight size={19}/></Magnetic>
              <a href={profile.github} className="text-link" target="_blank" rel="noreferrer">View GitHub <ArrowUpRight size={17}/></a>
              {profile.resume && <a href={profile.resume} className="text-link"><Download size={16}/> Résumé</a>}
            </div>
          </div>
          <div className="hero-art" id="classifier"><LearningStudy/></div>
        </div>
        <div className="hero-bottom"><a href="#about" className="scroll-hint"><span><ArrowDown size={16}/></span> SCROLL TO EXPLORE</a>
          <div className="specialty"><span className="live-dot"/><span>{specialties[specialty]}</span></div><span className="edition">PORTFOLIO / VOL. 01</span></div>
      </section>
      <nav className="notebook-index" aria-label="ML experiment index">
        <span>THE ML NOTEBOOK</span>{notebook.map(note => <a key={note.href} href={note.href}><small>{note.number}</small>{note.title}<ArrowUpRight size={15}/></a>)}
      </nav>
      <section id="about" className="section about">
        <SectionLabel number="01" title="ABOUT ME" note="HYDERABAD, INDIA"/>
        <div className="about-grid"><div>
          <h2 className="section-heading">Curiosity is<br/>my <span className="serif coral">starting point.</span></h2>
          <DescentNote/>
        </div>
        <div className="about-text">
          <p className="large-copy">I like the space between<br/><span className="highlight">“what if?”</span> and <span className="highlight mint">“it works.”</span></p>
          <p>I’m Abhiram, an AIML student at Gokaraju Rangaraju Institute of Engineering and Technology. I like questions that make me build something to understand them.</p>
          <p>How far can an attendance system trust a location reading? What should a security tool do while it waits for human approval? Those questions led me into computer vision, geospatial software, and systems design.</p>
          <div className="about-notes"><span><b>Studying</b>Artificial Intelligence &amp; ML</span><span><b>Exploring</b>Synthetic data &amp; privacy</span></div>
        </div></div>
      </section>
      <section id="projects" className="section projects-section">
        <SectionLabel number="02" title="SELECTED WORK" note="PROJECT INDEX"/>
        <div className="section-title-row"><div><h2 className="section-heading">A few things<br/>I’m <span className="serif coral">building.</span></h2>
          <p className="collection-intro">Ocean mapping, computer vision, and tools for safer systems. Open a study to explore its design and current progress.</p>
        </div><VisionWorkbench/></div>
        <ProjectGallery/>
      </section>
      <section id="skills" className="section skills-section">
        <SectionLabel number="03" title="THE TOOLKIT" note="TOOLS &amp; EXPERIMENTS"/>
        <h2 className="section-heading">Inside my <span className="serif">toolkit.</span></h2>
        <div className="skills-grid"><div id="convolution"><FeatureStudy/></div>
          <div className="skill-list">{skillGroups.map((group,i) =>
            <div key={group.name} className={`skill-row ${openSkill===i?'expanded':''}`}>
              <button onClick={() => setOpenSkill(openSkill===i?null:i)} aria-expanded={openSkill===i} aria-controls={`skill-${i}`}>
                <span className="mono">0{i+1}</span><strong>{group.name}</strong>{openSkill===i?<Minus size={18}/>:<Plus size={18}/>}
              </button>
              <div id={`skill-${i}`} hidden={openSkill!==i}><small>{group.detail}</small>
                <div className="skill-chips">{group.items.map(t=><span key={t}>{t}</span>)}</div>
              </div>
            </div>
          )}</div>
        </div>
      </section>
      <section id="journey" className="section journey">
        <SectionLabel number="04" title="MY JOURNEY" note="STUDY / EXPERIMENT / COLLABORATE"/>
        <h2 className="section-heading">From coursework<br/>to <span className="serif coral">collaboration.</span></h2>
        <div className="timeline">{chapters.map((chapter,i)=>
          <article key={chapter.label} className="timeline-item">
            <span className="timeline-number">0{i+1}</span><small>{chapter.label}</small>
            <h3>{chapter.title}</h3><p>{chapter.body}</p><a href={chapter.href} className="chapter-link">{chapter.link}<ArrowUpRight size={15}/></a>
          </article>
        )}</div>
      </section>
      <GitHubExplorer initialRepos={initialRepos}/>
      <section id="contact" className="contact-section"><div className="contact-inner">
        <SectionLabel number="06" title="CONTACT" note="LET’S CONNECT"/>
        <div className="contact-letter"><h2>Have an idea<br/>worth <span className="serif">building?</span></h2>
          <p>If you’re putting a hackathon team together, exploring an ML problem,<br/>or looking for a collaborator, I’d love to hear what you have in mind.</p>
          <div className="contact-actions">
            <Magnetic href={`mailto:${profile.email}`}>Say hello <ArrowUpRight size={20}/></Magnetic>
            <button className="copy-button" aria-label="Copy email address" onClick={copyEmail}>
              {copyStatus==='Email copied'?<Check size={17}/>:<Copy size={17}/>}<span>{copyStatus==='Email copied'?'Email copied!':profile.email}</span>
            </button>
          </div>
          <span className={copyStatus.startsWith('Copy this')?'copy-fallback':'sr-only'} role="status">{copyStatus}</span>
        </div>
        <div className="contact-links"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16}/></a>
          {profile.linkedin && <a href={profile.linkedin}>LinkedIn <ArrowUpRight size={16}/></a>}
          {profile.resume && <a href={profile.resume}>Résumé <Download size={16}/></a>}
          <span>HYDERABAD, INDIA ↗</span>
        </div>
      </div></section>
    </main>
    <footer className="footer"><div><Monogram/><span>ABHIRAM NELLUTLA</span></div><p>Designed with curiosity. Built with code.</p><a href="#home">Back to top <ArrowUpRight size={16}/></a></footer>
    <dialog ref={dialog} className="command-dialog" aria-label="Search the portfolio" onCancel={()=>setPalette(false)}
      onClose={()=>{setPalette(false);setQuery('');}} onClick={event=>{if(event.target===event.currentTarget)setPalette(false);}}>
      <div className="command-head"><Search size={20}/>
        <input autoFocus aria-label="Search navigation" placeholder="Find a project or experiment…" value={query} onChange={event=>setQuery(event.target.value)}/>
        <button aria-label="Close command palette" onClick={()=>setPalette(false)}><X size={20}/></button>
      </div>
      <div className="command-results">{commands.map(item =>
        <a key={item.href} href={item.href} onClick={()=>setPalette(false)}>{item.name}<span>{item.group}</span></a>
      )}{commands.length===0 && <p className="palette-empty">No matches for “{query}”. Try a project name or “training”.</p>}</div>
      <small>Tab to navigate · Enter to select · Esc to close</small>
    </dialog>
  </>;
}
