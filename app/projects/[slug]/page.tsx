import type { Metadata, ResolvingMetadata } from 'next';

import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { profile } from '@/data/profile';
import ProjectVisual from '@/components/project-visual';
import './case-study.css';

type ProjectRoute = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectRoute, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const images = (await parent).openGraph?.images;
  const permalink = `/projects/${slug}/`;
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: permalink },
    openGraph: {
      title: `${project.title} · Abhiram Nellutla`,
      description: project.description,
      url: permalink,
      siteName: 'Abhiram Nellutla',
      images,
      type: 'article',
    },
  };
}

export default async function ProjectPage({ params }: ProjectRoute) {
  const { slug } = await params;
  const index = projects.findIndex(item => item.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const repoUrl = project.repo ? `${profile.github}/${project.repo}` : undefined;

  return <main id="main" className="case-page" data-theme={project.theme}>
    <nav className="case-nav" aria-label="Portfolio navigation">
      <a href="/" className="monogram" aria-label="Abhiram Nellutla home">a<span>n</span><i/></a>
      <a href="/#projects"><ArrowLeft size={16} aria-hidden="true"/> All projects</a>
    </nav>
    <header className="case-header">
      <div className="case-overline"><span>FIELD NOTES / {String(index + 1).padStart(2, '0')}</span><span>{project.category}</span></div>
      <h1>{project.title}</h1>
      <p className="case-kicker">{project.kicker}</p>
      <div className="case-meta">
        <span className="case-status">{project.status}</span>
        <span>{project.stack.join(' / ')}</span>
      </div>
    </header>
    <ProjectVisual theme={project.theme} interactive/>
    <p className="case-caption">Interactive study with synthetic inputs.</p>
    <div className="case-body">
      <aside>
        <h2>Project brief</h2>
        <p>{project.description}</p>
        {repoUrl && <a href={repoUrl} target="_blank" rel="noreferrer" className="button primary">
          Explore source <ArrowUpRight size={17} aria-hidden="true"/>
        </a>}
      </aside>
      <article>
        <section><span className="eyebrow">01 / THE PROBLEM</span>
          <h2>{project.question}</h2>
          <p>{project.problem}</p>
        </section>
        <section><span className="eyebrow">02 / ARCHITECTURE</span>
          <h2>Inside {project.title}</h2>
          <p>{project.approach}</p>
          <ol className="case-stages">
            {project.stages.map((stage, i) => <li key={stage.title}>
              <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div><h3>{stage.title}</h3><p>{stage.detail}</p></div>
            </li>)}
          </ol>
        </section>
        <section className="engineering-note"><span className="eyebrow">03 / ENGINEERING NOTE</span>
          <h2>The tricky part</h2>
          <p>{project.challenge}</p>
        </section>
        <section><span className="eyebrow">04 / PROGRESS</span>
          <h2>Where it stands</h2>
          <p>{project.evidence}</p>
          {repoUrl && <a className="text-link case-readme" href={`${repoUrl}#readme`} target="_blank" rel="noreferrer">
            Project documentation <ArrowUpRight size={15} aria-hidden="true"/>
          </a>}
          <h3 className="case-next-step">Next step</h3>
          <p>{project.future}</p>
        </section>
      </article>
    </div>
    <a href={`/projects/${next.slug}/`} className="next-project">
      <small>NEXT PROJECT</small><span>{next.title}<ArrowUpRight aria-hidden="true"/></span>
    </a>
    <footer className="footer"><span>ABHIRAM NELLUTLA</span><a href="/#contact">Contact <ArrowUpRight size={14} aria-hidden="true"/></a></footer>
  </main>;
}
