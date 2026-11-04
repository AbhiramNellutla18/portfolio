import 'server-only';
import { profile } from '@/data/profile';

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  homepage: string | null;
  fork: boolean;
};

export async function getRepositories(): Promise<Repo[]> {
  const headers = new Headers({ Accept: 'application/vnd.github+json' });
  if (process.env.GITHUB_TOKEN) headers.set('Authorization', `Bearer ${process.env.GITHUB_TOKEN}`);
  const signal = AbortSignal.timeout(8000);
  const result: Repo[] = [];
  try {
    for (let page = 1; ; page++) {
      const response = await fetch(
        `https://api.github.com/users/${profile.username}/repos?per_page=100&sort=updated&page=${page}`,
        { headers, signal },
      );
      if (!response.ok) return [];
      const data = await response.json() as (Repo & { private: boolean })[];
      if (!Array.isArray(data)) return [];
      // Only public, displayable fields enter the page's serialized build snapshot.
      for (const repo of data) {
        if (repo.private !== false || !repo.name || typeof repo.id !== 'number') continue;
        const { id, name, description, html_url, language, stargazers_count, updated_at, homepage, fork } = repo;
        result.push({ id, name, description, html_url, language, stargazers_count, updated_at, homepage, fork });
      }
      if (!response.headers.get('Link')?.includes('rel="next"')) return result;
    }
  } catch {
    return [];
  }
}
