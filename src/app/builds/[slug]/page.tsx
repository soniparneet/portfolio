import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { builds } from '../../../content/builds';
import { projectPath } from '../../../content/projects';
import { ProjectPage } from '../../../components/project';
import { publication } from '../../../lib/publication.mjs';

const listed = builds.filter(p => p.publication === 'listed');
export function generateStaticParams() { return listed.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = listed.find(p => p.slug === slug);
  if (!project) return { title: 'Project not found' };
  const { origin } = publication();
  return { title: project.title, description: project.summary, ...(origin ? { alternates: { canonical: `${origin}${projectPath(project)}` } } : {}) };
}
export default async function BuildPage({ params }: Props) {
  const { slug } = await params;
  const project = listed.find(p => p.slug === slug);
  if (!project) notFound();
  return <ProjectPage project={project} related={listed.filter(p => p.slug !== slug)} />;
}
