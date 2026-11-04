'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Code2, Github, Search } from 'lucide-react';
import { profile, repositoryConfig } from '@/data/profile';
import { projects } from '@/data/projects';
import type { Repo } from '@/lib/github';

const CACHE_KEY = 'an-github-v1';
const CACHE_LIFETIME = 60 * 60 * 1000;
const colors = ['#ffd6bf', '#c4b5fd', '#b8f2d0', '#a5d8ff', '#ffc477'];
const languagesFromManifests: Record<string, string> = {
  Kavacha: 'Python', HealthGrid: 'TypeScript', BrokenVault: 'Rust',
};

type Card = {
  name: string;
  description: string;
  language: string;
  stars?: number;
  updated?: string;
  website?: string;
};

const reviewedProjects: Card[] = projects.flatMap(project => project.repo ? [{
  name: project.repo,
  description: project.description,
  language: languagesFromManifests[project.repo] || 'Unspecified',
}] : []);

function websiteLink(value: string | null): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href;
  } catch { /* GitHub permits free text in a repository's website field. */ }
}

function asCards(repositories: Repo[]): Card[] {
  return repositories.map(repo => ({
    name: repo.name,
    description: repo.description?.trim() || reviewedProjects.find(project => project.name === repo.name)?.description || '',
    language: repo.language || languagesFromManifests[repo.name] || 'Unspecified',
    stars: repo.stargazers_count,
    updated: repo.updated_at,
    website: websiteLink(repo.homepage),
  }));
}

// Cached entries may predate this client or have been edited in local storage.
function isRepoList(value: unknown): value is Repo[] {
  return Array.isArray(value) && value.every(item =>
    item && typeof item.name === 'string' && /^[\w.-]+$/.test(item.name) &&
    Number.isInteger(item.id) && Number.isInteger(item.stargazers_count) &&
    typeof item.updated_at === 'string' && Number.isFinite(Date.parse(item.updated_at)) &&
    [item.description, item.language, item.homepage].every(field => field === null || typeof field === 'string')
  );
}

function readCache(): { data: Repo[]; time: number } | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Number.isFinite(saved.time) && saved.time > 0 && saved.time <= Date.now() && isRepoList(saved.data)) {
      return saved;
    }
  } catch { /* A blocked storage API or invalid cache should not prevent the public request. */ }
}

async function fetchPublicRepos(signal: AbortSignal) {
  const all: Repo[] = [];
  for (let page = 1; ; page++) {
    const response = await fetch(
      `https://api.github.com/users/${profile.username}/repos?per_page=100&sort=updated&page=${page}`,
      { signal },
    );
    if (!response.ok) throw new Error('GitHub request failed');
    const data: unknown = await response.json();
    if (!isRepoList(data)) throw new Error('Unexpected repository data');
    all.push(...data);
    if (!response.headers.get('Link')?.includes('rel="next"')) return all;
  }
}

export default function GitHubExplorer({ initialRepos }: { initialRepos: Repo[] }) {
  const [repos, setRepos] = useState<Repo[] | null>(initialRepos.length ? initialRepos : null);
  const [status, setStatus] = useState(initialRepos.length ? 'GitHub snapshot from publication.' : 'Checking GitHub for the latest repositories…');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    const cached = readCache();
    if (cached) {
      setRepos(cached.data);
      setStatus('Showing a saved GitHub snapshot.');
      if (Date.now() - cached.time < CACHE_LIFETIME) return;
    }
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    async function refresh() {
      try {
        const data = await fetchPublicRepos(controller.signal);
        if (!mounted) return;
        setRepos(data);
        setStatus('Latest public repositories from GitHub.');
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data }));
        } catch { /* The fetched list is already available in memory. */ }
      } catch {
        if (mounted) setStatus(cached || initialRepos.length
          ? 'GitHub is unavailable. Showing a saved snapshot.'
          : 'GitHub is unavailable. Showing repositories reviewed for this portfolio.');
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void refresh();
    return () => {
      mounted = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [initialRepos.length]);

  function rank(name: string) {
    const index = repositoryConfig.featured.indexOf(name);
    return index < 0 ? Infinity : index;
  }
  const visible = (repos ? asCards(repos) : reviewedProjects)
    .filter(repo => !repositoryConfig.hidden.includes(repo.name))
    .sort((first, second) => rank(first.name) - rank(second.name) || first.name.localeCompare(second.name));
  const counts = new Map<string, number>();
  for (const repo of visible) counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
  const languages = [...counts.keys()].sort();
  const selected = counts.has(language) ? language : 'All';
  const search = query.trim().toLowerCase();
  const results = visible.filter(repo => (selected === 'All' || repo.language === selected) &&
    `${repo.name} ${repo.description} ${repo.language}`.toLowerCase().includes(search));

  return <section id="github" className="section github-section">
    <div className="section-label"><span>05 / SOURCE CODE</span><span><Github size={14}/> GITHUB</span></div>
    <div className="section-title-row">
      <h2 className="section-heading">Explore the<br/><span className="serif">repositories.</span></h2>
      <a href={profile.github} className="text-link" target="_blank" rel="noreferrer">@{profile.username} <ArrowUpRight size={18}/></a>
    </div>
    <div className="repo-toolbar">
      <label className="search-field"><Search size={18}/><input type="search" aria-label="Search repositories"
        placeholder="Find a repository…" value={query} onChange={event => setQuery(event.target.value)}/></label>
      <label className="language-select">Language
        <select aria-label="Filter repositories by language" value={selected} onChange={event => setLanguage(event.target.value)}>
          <option>All</option>{languages.map(name => <option key={name}>{name}</option>)}
        </select>
      </label>
    </div>
    <p className="repo-state" role="status">{status}</p>
    {languages.length > 0 && <>
      <div className="language-distribution" aria-label="Repository counts by language">
        {languages.map((name, index) => <span key={name} style={{ flex: counts.get(name), background: colors[index % colors.length] }}>
          {name} · {counts.get(name)}
        </span>)}
      </div>
      <small className="quiet-note">One language per repository, from GitHub or its dependency manifest.</small>
    </>}
    <p className="sr-only" role="status">{results.length} matching repositories</p>
    {results.length > 0 ? <div className="repos">
      {results.map(repo => <article key={repo.name} className="repo-card relative">
        <div><Code2 size={20}/>{repositoryConfig.featured.includes(repo.name) && <small>Featured source</small>}</div>
        <h3><a className="inline-flex items-center gap-2 after:absolute after:inset-0" href={`${profile.github}/${encodeURIComponent(repo.name)}`}
          target="_blank" rel="noreferrer">{repo.name}<ArrowUpRight size={17}/></a></h3>
        {repo.description && <p>{repo.description}</p>}
        {repo.website && <a className="text-link relative z-10" href={repo.website} target="_blank" rel="noreferrer">Project website <ArrowUpRight size={14}/></a>}
        <footer><span>{repo.language}{repo.stars !== undefined && ` · ☆ ${repo.stars}`}</span>
          {repo.updated && <time dateTime={repo.updated}>Updated {new Date(repo.updated).toLocaleDateString('en', {
            month: 'short', year: 'numeric', timeZone: 'UTC',
          })}</time>}
        </footer>
      </article>)}
    </div> : <div className="empty-state" role="status">
      {visible.length ? <>
        <p>No repositories match these filters.</p>
        <button type="button" className="text-link underline" onClick={() => { setQuery(''); setLanguage('All'); }}>Clear filters</button>
      </> : <p>There are no public repositories to display.</p>}
    </div>}
  </section>;
}
