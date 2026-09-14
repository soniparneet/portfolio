/** @jsxImportSource react */
import { renderToStaticMarkup } from 'react-dom/server';
import { test, expect } from '@playwright/test';
import { mkdir, readFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { ProjectOverview, ProjectActions } from '../src/components/project';
import { builds } from '../src/content/builds';
import { ProfileAction } from '../src/components/site';
import { profile } from '../src/content/profile';
import { projects } from '../src/content/projects';
import { publication } from '../src/lib/publication.mjs';
import { cover, gallery } from './fixtures/gallery';

test.use({ javaScriptEnabled: false });

test('same project template: cover, ordered gallery, section image and independent prototype', async ({ page }, testInfo) => {
  await page.goto('/');
  const css = await page.locator('link[rel="stylesheet"]').evaluateAll(nodes => nodes.map(n => n.outerHTML).join(''));
  const fontClass = await page.locator('html').getAttribute('class');
  // Only the test browser serves these fixtures. No fixture route or public files exist.
  await page.context().route('**/projects/uber-tasks/test-*.svg', async route => {
    const file = path.basename(new URL(route.request().url()).pathname);
    await route.fulfill({ contentType: 'image/svg+xml', body: await readFile(`tests/fixtures/${file}`) });
  });
  for (const base of [projects[0], builds[1]]) {
  for (const count of [0, 1, 3]) {
    const project = { ...base, homepageExcerpt: undefined, cover: count ? cover : undefined, gallery: gallery.slice(0, count) };
    await page.setContent(`<!doctype html><html lang="en" class="${fontClass}"><head>${css}</head><body><main class="shell">${renderToStaticMarkup(<ProjectOverview project={project} />)}</main></body></html>`);
    await expect(page.locator('.gallery figure')).toHaveCount(count);
    await expect(page.getByRole('heading', { name: 'A closer look' })).toHaveCount(count ? 1 : 0);
    await expect(page.getByRole('link', { name: /Explore reconstructed prototype/ })).toHaveCount(0);
    const ids = await page.locator('.gallery figure').evaluateAll(nodes => nodes.map(n => n.getAttribute('data-image-id')));
    expect(ids).toEqual(gallery.slice(0, count).toSorted((a, b) => a.order - b.order).map(a => a.id));
    for (const img of await page.locator('img:visible').all()) {
      // Native scrolling avoids animation-frame stability polling in the no-JS context.
      await img.evaluate(image => image.scrollIntoView({ behavior: 'instant' }));
      await img.evaluate(image => (image as HTMLImageElement).decode());
    }
    expect(await page.locator('img:visible').evaluateAll(images => images.every(node => { const image = node as HTMLImageElement; return Math.abs(image.getBoundingClientRect().width / image.getBoundingClientRect().height - image.naturalWidth / image.naturalHeight) < 0.01; }))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await mkdir('output/playwright', { recursive: true });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `output/playwright/gallery-${base.category}-${count}-${testInfo.project.name}.png`, fullPage: true });
    if (count) {
      // Static/no-JavaScript fixture preserves the full-image link fallback.
      const inspect = page.getByRole('link', { name: /Open full image/ }).first();
      await inspect.focus();
      await expect(inspect).toBeFocused();
      const opened = page.waitForEvent('popup');
      await page.keyboard.press('Enter');
      const popup = await opened;
      await expect(popup).toHaveURL(/test-cover.svg$/);
      await popup.close();
    }
  }
  }
  const withNarrative = { ...projects[0], sections: [{ ...projects[0].sections[0], images: [cover] }], prototype: { status: 'available' as const, href: '/approved-demo' } };
  await page.setContent(renderToStaticMarkup(<ProjectOverview project={withNarrative} />));
  await expect(page.locator('.narrative figure')).toHaveCount(1);
  await expect(page.getByRole('link', { name: /Explore reconstructed prototype/ })).toHaveAttribute('href', '/approved-demo');
  await expect(page.getByText('Reconstructed prototype - synthetic data.', { exact: true })).toBeVisible();
});

test('repository, live product, example and prototype actions render independently', async ({ page }) => {
  const base = { ...builds[1], repository: undefined, exampleUrl: undefined, liveUrl: undefined };
  for (const field of ['repository', 'liveUrl', 'exampleUrl', 'prototype'] as const) {
    const project = { ...base, [field]: field === 'repository' ? builds[1].repository : field === 'prototype' ? { status: 'available' as const, href: '/fixture-demo' } : field === 'liveUrl' ? 'https://example.test/live' : 'https://example.test/example' };
    await page.setContent(renderToStaticMarkup(<ProjectOverview project={project} />));
    await expect(page.getByRole('link', { name: /View project on GitHub/ })).toHaveCount(field === 'repository' ? 1 : 0);
    await expect(page.getByRole('link', { name: /View live product/ })).toHaveCount(field === 'liveUrl' ? 1 : 0);
    await expect(page.getByRole('link', { name: /See an example/ })).toHaveCount(field === 'exampleUrl' ? 1 : 0);
    await expect(page.getByRole('link', { name: /Explore reconstructed prototype/ })).toHaveCount(field === 'prototype' ? 1 : 0);
  }
  await page.setContent(renderToStaticMarkup(<ProjectActions project={{ ...projects[0], repository: builds[0].repository, liveUrl: builds[0].liveUrl }} />));
  await expect(page.locator('a')).toHaveCount(0);
});

test('local résumé fallback follows approval and file existence; external mode overrides both', async ({ page }) => {
  const root = await mkdtemp(path.join(tmpdir(), 'portfolio-browser-resume-'));
  try {
    for (const exists of [false, true]) {
      if (exists) { await mkdir(path.join(root, 'public/resume'), { recursive: true }); await writeFile(path.join(root, 'public/resume/parneet-soni-resume.pdf'), 'non-confidential fixture'); }
      for (const approved of [false, true]) {
        const { resumeAvailable } = publication({ RESUME_APPROVED: String(approved) }, root);
        await page.setContent(renderToStaticMarkup(<ProfileAction resumeAvailable={resumeAvailable} externalResume={{ ...profile.resume, enabled: false }} />));
        await expect(page.getByRole('link')).toHaveAttribute('href', exists && approved ? '/resume/parneet-soni-resume.pdf' : 'https://www.linkedin.com/in/soniparneet/');
        await expect(page.getByRole('link')).toContainText(exists && approved ? 'View résumé' : 'LinkedIn');
        await page.setContent(renderToStaticMarkup(<ProfileAction resumeAvailable={resumeAvailable} />));
        await expect(page.getByRole('link', { name: 'View résumé (opens in a new tab)', exact: true })).toHaveAttribute('href', profile.resume.href);
        await expect(page.getByRole('link')).toHaveAttribute('target', '_blank');
        await expect(page.getByRole('link')).not.toHaveAttribute('download');
      }
    }
  } finally { await rm(root, { recursive: true }); }
});
