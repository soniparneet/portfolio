import type { MetadataRoute } from 'next';
import { publication } from '../lib/publication.mjs';
import { projects, projectPath } from '../content/projects';
import { builds } from '../content/builds';
export default function sitemap(): MetadataRoute.Sitemap {
  const { indexable, origin } = publication();
  if (!indexable || !origin) return [];
  return ['', ...[...projects, ...builds].filter(p => p.publication === 'listed').map(projectPath)].map(path => ({ url: `${origin}${path}` }));
}
