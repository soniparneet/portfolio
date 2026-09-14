/** @jsxImportSource react */
import { profile, type ExternalResume } from '../content/profile';
import { resumePath, publication } from '../lib/publication.mjs';
import { Navigation } from './navigation';

export function BrandMark() { return <span className="brand-mark" aria-hidden="true">ps</span>; }
export function ProfileAction({ resumeAvailable = false, externalResume = profile.resume, variant = 'text' }: { resumeAvailable?: boolean; externalResume?: ExternalResume; variant?: 'text' | 'secondary' }) {
  const external = externalResume.enabled;
  const isResume = external || resumeAvailable;
  return <a className={variant === 'secondary' ? 'button button-secondary' : 'text-link'} href={external ? externalResume.href : resumeAvailable ? resumePath : profile.linkedin} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{isResume ? 'View résumé' : 'LinkedIn'}{external && <span className="sr-only"> (opens in a new tab)</span>} <span className="link-icon" aria-hidden="true">{external || !isResume ? '↗' : '→'}</span></a>;
}
export function Header({ resumeAvailable }: { resumeAvailable: boolean }) {
  const hasResume = profile.resume.enabled || resumeAvailable;
  return <header className="site-header"><div className="shell header-inner"><a className="identity" href="/"><BrandMark /><span>{profile.name}<span className="sr-only"> - home</span></span></a><Navigation resumeAction={hasResume ? <ProfileAction variant="secondary" resumeAvailable={resumeAvailable} /> : undefined} />{hasResume && <div className="nav-resume"><ProfileAction variant="secondary" resumeAvailable={resumeAvailable} /></div>}</div></header>;
}
export function Contact() {
  return <section id="contact" className="contact" aria-labelledby="contact-heading"><div className="shell section-grid contact-inner"><div><h2 id="contact-heading">Let’s talk</h2><p>{profile.contact}</p></div><div className="contact-actions"><a className="email-link" href={`mailto:${profile.email}`}>Email: {profile.email}</a><div className="contact-links"><ProfileAction resumeAvailable={publication().resumeAvailable} /><a className="text-link" href={profile.linkedin}>LinkedIn <span className="link-icon" aria-hidden="true">↗</span></a><a className="text-link" href={profile.github}>GitHub <span className="link-icon" aria-hidden="true">↗</span></a></div></div></div></section>;
}
export function Footer() {
  return <footer className="shell footer"><div className="footer-identity"><span>{profile.name}</span><span>{profile.location}</span></div><a className="text-link" href="#top">Back to top <span className="link-icon" aria-hidden="true">↑</span></a></footer>;
}
