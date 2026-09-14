import type { Metadata } from 'next';
import { profile } from '../content/profile';
import { projects } from '../content/projects';
import { builds } from '../content/builds';
import { ProjectCard, WorkRow } from '../components/project';
import { Contact, ProfileAction } from '../components/site';
import { publication } from '../lib/publication.mjs';
import './home.css';

const settings = publication();
export const metadata: Metadata = { ...(settings.origin ? { alternates: { canonical: settings.origin } } : {}) };
export default function Home() {
  return <><main id="main" className="home" tabIndex={-1}>
    <section className="shell hero" aria-labelledby="hero-heading">
      <p className="hero-category">{profile.label}</p>
      <h1 id="hero-heading">{profile.headline}</h1>
      <div className="hero-bottom"><p>{profile.intro}</p><div className="hero-actions"><a className="button" href="#work">Explore my work <span className="link-icon" aria-hidden="true">→</span></a><ProfileAction variant="secondary" resumeAvailable={settings.resumeAvailable} /></div></div>
    </section>
    <section id="work" className="shell work-section" aria-labelledby="work-heading"><div className="section-heading"><div><h2 id="work-heading">Selected work</h2></div></div><div className="work-grid">{projects.filter(p => p.publication === 'listed').map(project => <WorkRow key={project.slug} project={project} />)}</div></section>
    <section id="builds" className="shell builds-section" aria-labelledby="builds-heading"><div className="section-heading"><h2 id="builds-heading">Independent projects</h2></div><div className="builds-grid">{builds.filter(p => p.publication === 'listed').map(project => <ProjectCard key={project.slug} project={project} />)}</div></section>
    <section id="experience" className="shell section-grid experience-section" aria-labelledby="experience-heading"><div className="section-heading"><div><h2 id="experience-heading">Experience</h2></div></div><div className="experience-list">{profile.experience.map(item => <article key={item.company} className="experience-row"><h3>{item.company}</h3><div><h4>{item.role}</h4><p>{item.summary}</p></div></article>)}<div className="experience-row earlier"><h3>Earlier chapters</h3><p>Venture capital, impact investing, technology consulting, and e-governance.</p></div></div></section>
    <section id="about" className="shell section-grid about-section" aria-labelledby="about-heading"><h2 id="about-heading">About me</h2><div className="about-copy"><p>{profile.about}</p></div></section>
    <Contact />
  </main></>;
}
