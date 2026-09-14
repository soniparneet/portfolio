/** @jsxImportSource react */
import type { Project, NarrativeSection } from '../content/projects';
import type { ReactNode } from 'react';
import { projectPath } from '../content/projects';
import { Contact } from './site';
import { ProjectFigure } from './project-figure';
export { ProjectFigure } from './project-figure';

export function ExamplePreview({ excerpt }: { excerpt: NonNullable<NarrativeSection['excerpt']> }) {
  return <figure className="example-excerpt"><p className="example-label">Example</p><blockquote><p>{excerpt.text}</p></blockquote><figcaption><a href={excerpt.href}>{excerpt.label} <span className="link-icon" aria-hidden="true">↗</span></a></figcaption></figure>;
}
function ReadableExample({ excerpt }: { excerpt: NonNullable<Project['homepageExcerpt']> }) {
  return <figure className="practice-excerpt">
    <figcaption>Example output - reformatted for readability.</figcaption>
    <blockquote><p>{excerpt.text}</p></blockquote>
    <p className="excerpt-context">{excerpt.context}</p>
  </figure>;
}
export function ProjectOutcomes({ project }: { project: Project }) {
  return <><dl className="outcome-grid">{project.outcomes.filter(metric => !metric.statement).map(metric => <div key={metric.label}>
    <dt>{metric.label}</dt><dd>{metric.value}</dd>{metric.context && <dd className="metric-context">{metric.context}{metric.value.includes('$') ? ' · US dollars' : ''}</dd>}
  </div>)}</dl>{project.outcomes.filter(metric => metric.statement).map(metric => <p className="supporting-outcome" key={metric.label}>{metric.statement}</p>)}</>;
}
export function WorkOutcome({ value, label, supportingPoint, action }: { value: string; label: string; supportingPoint: string; action: ReactNode }) {
  return <div className="work-outcome">
    <dl><dt>{label}</dt><dd>{value}</dd></dl>
    <ul><li>{supportingPoint}</li></ul>
    {action}
  </div>;
}
export function WorkRow({ project }: { project: Project }) {
  return <article className="work-project work-row">
    <div className="work-context"><p className="work-company">{project.company}</p><p className="work-role">{project.role}</p></div>
    <div className="work-narrative"><h3>{project.title}</h3><p className="work-summary">{project.summary}</p></div>
    <div className="work-evidence">{project.homepageOutcome && <WorkOutcome
      value={project.outcomes[0].value}
      label={project.homepageOutcome.label || project.outcomes[0].label}
      supportingPoint={project.homepageOutcome.supportingPoint}
      action={<a className="text-link story-link" href={projectPath(project)}>Read overview<span className="sr-only"> - {project.title}</span> <span className="link-icon" aria-hidden="true">→</span></a>}
    />}
    </div>
    {project.cover && <div className="work-media"><ProjectFigure asset={project.cover} compact /></div>}
  </article>;
}
export function ProjectCard({ project }: { project: Project }) {
  return <article className="independent-project">
    <header className="build-identity"><h3>{project.title}</h3><p>{project.summary}</p></header>
    {project.cover && <div className="build-preview"><ProjectFigure asset={project.cover} compact /></div>}
    <div className="build-context"><p>{project.format}</p></div>
    <div className="project-links"><a className="text-link story-link" href={projectPath(project)}>Read case study<span className="sr-only"> - {project.title}</span> <span className="link-icon" aria-hidden="true">→</span></a><ProjectActions project={project} compact /></div>
  </article>;
}
export function ProjectActions({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (project.category !== 'independent') return null;
  return <div className="project-actions">
    {project.liveUrl && <a className="text-link" href={project.liveUrl}>View live product <span className="link-icon" aria-hidden="true">↗</span></a>}
    {project.repository && <a className="text-link" href={project.repository.href}>{project.repository.label} <span className="link-icon" aria-hidden="true">↗</span></a>}
    {!compact && project.exampleUrl && <a className="text-link" href={project.exampleUrl}>See an example <span className="link-icon" aria-hidden="true">↗</span></a>}
  </div>;
}
export function ProjectOverview({ project }: { project: Project }) {
  const independent = project.category === 'independent';
  const sections = [project.responsibility, ...project.sections, project.decision, project.tradeoff, project.measurement].filter(s => s !== undefined);
  return <article className={independent ? 'independent-overview' : undefined}>
    <header className="project-header">
      <a className="text-link back-link" href={independent ? '/#builds' : '/#work'}><span className="link-icon" aria-hidden="true">←</span> {independent ? 'Independent projects' : 'All work'}</a>
      <p className="eyebrow">{independent ? 'Independent project' : project.company} <span className="separator">/</span> {independent ? 'Case study' : 'Project overview'}</p>
      <h1>{project.title}</h1>
      {project.descriptor && <p className="project-descriptor">{project.descriptor}</p>}
      <p className="project-role">{project.role}</p>
      <ul className="themes" aria-label="Product themes">{project.themes.map(theme => <li key={theme}>{theme}</li>)}</ul>
      <ProjectActions project={project} />
    </header>
    <section className="at-glance section-grid" aria-labelledby="at-glance">
      <h2 id="at-glance">At a glance</h2>
      <div><p className="lead">{project.summary}</p>{project.format && <p className="project-format">{project.format}</p>}{project.outcomes.length > 0 && <ProjectOutcomes project={project} />}{project.outcomeNote && <p className="outcome-note">{project.outcomeNote}</p>}</div>
    </section>
    {project.cover && <div className={`project-lead-image${project.homepageExcerpt ? ' has-readable-excerpt' : ''}`}>
      {project.homepageExcerpt && <div className="detail-readable-example">
        <p className="figure-title">User scope excerpt</p>
        <ReadableExample excerpt={project.homepageExcerpt} />
        <p className="excerpt-attribution">{project.homepageExcerpt.attribution}</p>
        {project.homepageExcerpt.limitation && <p className="excerpt-limitation">{project.homepageExcerpt.limitation}</p>}
      </div>}
      <ProjectFigure asset={project.cover} priority />
    </div>}
    <div className="narrative">{sections.map(section => <section key={section.id} aria-labelledby={section.id}>
      <h2 id={section.id}>{section.title}</h2>{section.body.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      {section.excerpt && <ExamplePreview excerpt={section.excerpt} />}
      {section.images?.toSorted((a, b) => a.order - b.order).map(asset => <ProjectFigure key={asset.id} asset={asset} />)}
    </section>)}</div>
    {project.gallery.length > 0 && <section className="gallery" aria-labelledby="gallery"><h2 id="gallery">A closer look</h2>{project.gallery.toSorted((a, b) => a.order - b.order).map(asset => <ProjectFigure key={asset.id} asset={asset} />)}</section>}
    {project.prototype.status === 'available' && project.prototype.href && <div className="prototype-link"><a className="button" href={project.prototype.href}>Explore reconstructed prototype <span className="link-icon" aria-hidden="true">→</span></a><p>Reconstructed prototype - synthetic data.</p></div>}
  </article>;
}
export function ProjectPage({ project, related }: { project: Project; related: Project[] }) {
  return <main id="main" tabIndex={-1}><div className="shell"><ProjectOverview project={project} /><nav className="related-work" aria-label="Related projects"><h2>More {project.category === 'independent' ? 'independent projects' : 'selected work'}</h2>{related.filter(p => p.publication === 'listed').map(item => <a href={projectPath(item)} key={item.slug}><span>{item.company !== item.title && <small>{item.company}</small>}{item.title}</span><span className="link-icon" aria-hidden="true">→</span></a>)}{project.category === 'independent' && <a href="/#work"><span>Back to selected work</span><span className="link-icon" aria-hidden="true">→</span></a>}</nav></div><Contact /></main>;
}
