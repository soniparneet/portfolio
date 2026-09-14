'use client';
import { useRef, type ReactNode } from 'react';

const links = ['Work', 'Builds', 'Experience', 'About', 'Contact'];
export function Navigation({ resumeAction }: { resumeAction?: ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);
  return <>
    <nav aria-label="Main navigation" className="desktop-nav">
      {links.map(label => <a key={label} href={`/#${label.toLowerCase()}`}>{label}</a>)}
    </nav>
    <details className="mobile-nav" ref={menu} onKeyDown={event => {
      if (event.key === 'Escape' && menu.current) { menu.current.open = false; menu.current.querySelector('summary')?.focus(); }
    }}>
      <summary>Menu <span aria-hidden="true">+</span></summary>
      <nav aria-label="Mobile navigation">{links.map(label => <a key={label} href={`/#${label.toLowerCase()}`} onClick={() => { if (menu.current) menu.current.open = false; }}>{label}</a>)}{resumeAction}</nav>
    </details>
  </>;
}
