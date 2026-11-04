import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
export const dynamic='force-static';
export default function sitemap(){return [{url:profile.siteUrl},...projects.map(p=>({url:`${profile.siteUrl}/projects/${p.slug}/`}))]}
