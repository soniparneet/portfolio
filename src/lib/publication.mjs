import { existsSync } from 'node:fs';
import path from 'node:path';

export const resumePath = '/resume/parneet-soni-resume.pdf';

/** @param {Record<string, string | undefined>} env */
export function publication(env = process.env, root = process.cwd()) {
  let origin;
  if (env.PRODUCTION_ORIGIN) {
    const url = new URL(env.PRODUCTION_ORIGIN);
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
      throw new Error('PRODUCTION_ORIGIN must be an explicit HTTPS production origin without a path, query or credentials.');
    }
    origin = url.origin;
  }
  const approved = env.PUBLICATION_APPROVED === 'true';
  if (approved && !origin) throw new Error('An approved release requires PRODUCTION_ORIGIN.');
  const indexable = approved && (!env.VERCEL_ENV || env.VERCEL_ENV === 'production');
  const resumeExists = existsSync(path.join(root, 'public', resumePath));
  return { origin, indexable, resumeExists, resumeAvailable: env.RESUME_APPROVED === 'true' && resumeExists };
}
