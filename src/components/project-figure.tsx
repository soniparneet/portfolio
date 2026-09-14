/** @jsxImportSource react */
'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { ProjectImage } from '../content/projects';

const provenanceLabels: Record<ProjectImage['provenance'], string> = {
  original: 'Original public-product screenshot',
  'sanitized original': 'Sanitized original screen',
  'reconstructed prototype': 'Reconstructed prototype - synthetic data.',
  'new concept': 'Design exploration',
  'owner-provided prototype': 'Owner-provided prototype',
  'owner-provided example': 'Owner-provided example',
};

export function ProjectFigure({ asset, priority = false, compact = false }: { asset: ProjectImage; priority?: boolean; compact?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const originScroll = useRef({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  const [nativeSize, setNativeSize] = useState(false);
  const view = compact && asset.preview ? asset.preview : asset;
  const caption = compact ? asset.previewCaption || asset.caption : asset.caption;
  const title = asset.title || asset.alt;
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    closeButton.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function close() {
    dialog.current?.close();
    setOpen(false);
    setNativeSize(false);
    trigger.current?.focus({ preventScroll: true });
    window.scrollTo({ left: originScroll.current.x, top: originScroll.current.y, behavior: 'instant' });
  }
  return <>
    <figure className={`project-figure ${asset.presentation || 'landscape'}`} data-image-id={asset.id}>
      {!compact && asset.title && <p className="figure-title">{asset.title}</p>}
      <button ref={trigger} type="button" className="image-inspect" aria-haspopup="dialog" aria-label={`Open image: ${title}`} onClick={() => { originScroll.current = { x: window.scrollX, y: window.scrollY }; setOpen(true); }}>
        <Image src={view.src} alt={asset.alt} width={view.width} height={view.height} style={{ maxWidth: view.width }} sizes={compact ? '(max-width: 800px) calc(100vw - 40px), (max-width: 1200px) 44vw, 532px' : '(max-width: 768px) calc(100vw - 40px), 1100px'} unoptimized={asset.provenance === 'owner-provided example'} preload={priority} />
      </button>
      <noscript><style>{'.image-inspect{display:none!important}'}</style><a href={asset.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full image: ${title} (opens in a new tab)`}><Image src={view.src} alt={asset.alt} width={view.width} height={view.height} unoptimized /></a></noscript>
      {!compact && <figcaption><span>{caption}</span><span className="provenance">{provenanceLabels[asset.provenance]}</span></figcaption>}
      {compact && !['original', 'owner-provided example'].includes(asset.provenance) && <figcaption>{provenanceLabels[asset.provenance]}</figcaption>}
    </figure>
    <dialog ref={dialog} className="image-dialog" aria-label={title} onCancel={event => { event.preventDefault(); close(); }} onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, [tabindex="0"]');
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}>
      {open && <>
        <div className="image-dialog-toolbar"><button ref={closeButton} type="button" onClick={close}><span className="link-icon" aria-hidden="true">←</span> Back to {compact ? 'portfolio' : 'project'}</button><button type="button" onClick={() => setNativeSize(value => !value)}>{nativeSize ? 'Fit image' : 'Actual size'}</button><p>{title}</p></div>
        <div className={`image-dialog-scroll ${nativeSize ? 'native-size' : ''}`} tabIndex={0} role="region" aria-label="Image view; scroll to inspect at actual size"><Image src={asset.src} width={asset.width} height={asset.height} alt={asset.alt} unoptimized /></div>
        <p className="image-dialog-caption">{asset.caption} <span className="provenance">{provenanceLabels[asset.provenance]}</span></p>
      </>}
    </dialog>
  </>;
}
