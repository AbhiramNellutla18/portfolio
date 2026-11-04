import Portfolio from '@/components/portfolio';
import { getRepositories } from '@/lib/github';
export default async function Home(){return <Portfolio initialRepos={await getRepositories()}/>}
