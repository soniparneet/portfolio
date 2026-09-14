import type { MetadataRoute } from 'next';
import { publication } from '../lib/publication.mjs';
export default function robots(): MetadataRoute.Robots {
  const { indexable, origin } = publication();
  return { rules: { userAgent: '*', ...(indexable ? { allow: '/' } : { disallow: '/' }) }, ...(indexable && origin ? { sitemap: `${origin}/sitemap.xml` } : {}) };
}
