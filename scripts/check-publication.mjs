import nextEnv from '@next/env';
import { publication } from '../src/lib/publication.mjs';
nextEnv.loadEnvConfig(process.cwd());
const settings = publication();
if (settings.resumeExists && !settings.resumeAvailable) {
  throw new Error('A PDF is in public/resume without RESUME_APPROVED=true. Move it to source-materials before building; hiding its link does not make it private.');
}
console.log(settings.indexable ? 'Approved publication build.' : 'Review build: noindex. No deployment performed.');
