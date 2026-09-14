import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import { projects, projectPath } from '../src/content/projects';
import { builds } from '../src/content/builds';
import { profile } from '../src/content/profile';

test('homepage, contact, review metadata and zero-image state', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(profile.headline);
  await expect(page.getByRole('link', { name: 'Parneet Soni - home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore my work' })).toHaveAttribute('href', '#work');
  await expect(page.getByRole('link', { name: 'Email: soniparneet@gmail.com' })).toHaveAttribute('href', 'mailto:soniparneet@gmail.com');
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: false }).first()).toHaveAttribute('href', 'https://www.linkedin.com/in/soniparneet/');
  await expect(page.locator('#contact').getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/soniparneet');
  await expect(page.locator('footer.footer').getByRole('link', { name: /GitHub|résumé/ })).toHaveCount(0);
  await expect(page.locator('footer.footer').getByRole('link', { name: /Site source/ })).toHaveCount(0);
  await expect(page.locator('#builds article')).toHaveCount(2);
  expect(await page.locator('main>section[id]').evaluateAll(nodes => nodes.map(n => n.id))).toEqual(['work', 'builds', 'experience', 'about', 'contact']);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /prototype|coming soon/i })).toHaveCount(0);
  await expect(page.getByText(/TODO|placeholder|source-materials|CV_Parneet/)).toHaveCount(0);
  expect(await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).toMatchObject({ violations: [] });
  expect(await new AxeBuilder({ page }).withRules(['label-content-name-mismatch']).analyze()).toMatchObject({ violations: [] });
  expect(errors).toEqual([]);
});

test('mobile navigation, anchors and keyboard skip link', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  if (isMobile) {
    await page.getByText('Menu', { exact: false }).first().click();
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('details')).not.toHaveAttribute('open');
    await page.locator('summary').click();
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Contact' }).click();
    await expect(page.locator('details')).not.toHaveAttribute('open');
    await expect(page).toHaveURL(/#contact$/);
  } else {
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work' }).click();
    await expect(page).toHaveURL(/#work$/);
  }
});

for (const project of projects) test(`${project.slug}: route, back and related navigation`, async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`/work/${project.slug}`);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title);
  await expect(page).toHaveTitle(`${project.title} | Parneet Soni`);
  await expect(page.getByRole('heading', { name: 'At a glance' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A closer look' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /prototype/ })).toHaveCount(0);
  await expect(page.locator('img')).toHaveCount(0);
  await expect(page.locator('article a[href*="github.com"]')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Related projects' }).getByRole('link')).toHaveCount(3);
  await page.getByRole('link', { name: 'All work', exact: true }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title);
  expect(errors).toEqual([]);
});

test('unknown slugs and missing pages return useful 404s', async ({ page }) => {
  for (const route of ['/work/does-not-exist', '/builds/does-not-exist', '/work/citizen-sir-watch', '/builds/uber-tasks', '/does-not-exist']) {
    expect((await page.goto(route))?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('A different pathto the work.');
    await expect(page.getByRole('link', { name: 'Explore my work' })).toHaveAttribute('href', '/#work');
  }
});

test('local links and assets resolve; private files do not', async ({ page, request }) => {
  for (const route of ['/', ...[...projects, ...builds].map(projectPath)]) {
    await page.goto(route);
    const paths = await page.locator('a[href^="/"], link[rel="icon"]').evaluateAll(elements => elements.map(e => e.getAttribute('href')!));
    for (const path of new Set(paths)) expect((await request.get(path.split('#')[0] || '/')).status(), path).toBe(200);
  }
  for (const path of ['/source-materials/README.md', '/CV_Parneet%20Soni_Product.pdf', '/resume/parneet-soni-resume.pdf', '/docs/CLAIMS.md', '/projects/uber-tasks/test-cover.svg']) expect((await request.get(path)).status()).toBe(404);
  expect((await request.get('/social-card.png')).status()).toBe(200);
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('<loc>');
});

test('responsive screenshots, overflow, project accessibility and reduced motion', async ({ page }, testInfo) => {
  test.setTimeout(60000);
  await mkdir('output/playwright', { recursive: true });
  for (const width of testInfo.project.name === 'desktop' ? [1440, 1024, 768, 375] : [390]) {
    await page.setViewportSize({ width, height: width > 768 ? 1000 : 844 });
    for (const route of ['/', '/work/uber-tasks', ...builds.map(projectPath)]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      for (const img of await page.locator('img:visible').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(image => (image as HTMLImageElement).decode()); }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} at ${width}`).toBe(true);
      const name = route === '/' ? 'home' : route.split('/').at(-1);
      await page.screenshot({ path: `output/playwright/${name}-${width}.png`, fullPage: true });
      if (width === 1440 || width === 390) await page.screenshot({ path: `output/playwright/${name}-${width}-viewport.png` });
      if (width === 1440 || width === 390) expect(await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).toMatchObject({ violations: [] });
    }
  }
  expect(await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).toMatchObject({ violations: [] });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

for (const project of builds) test(`${project.slug}: case study, scoped actions and back navigation`, async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  expect((await page.goto(projectPath(project)))?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title);
  await expect(page).toHaveTitle(`${project.title} | Parneet Soni`);
  await expect(page.locator('article').getByRole('link', { name: project.repository!.label })).toHaveAttribute('href', project.repository!.href);
  await expect(page.getByRole('link', { name: /prototype|Try live app/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'View live product' })).toHaveCount(project.liveUrl ? 1 : 0);
  if (project.liveUrl) await expect(page.getByRole('link', { name: 'View live product' })).toHaveAttribute('href', project.liveUrl);
  if (project.exampleUrl) await expect(page.getByRole('link', { name: 'See an example' })).toHaveAttribute('href', project.exampleUrl);
  await expect(page.locator('.gallery figure')).toHaveCount(project.gallery.length);
  for (const img of await page.locator('img:visible').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(image => (image as HTMLImageElement).decode()); }
  if (project.cover) {
    const inspect = page.getByRole('button', { name: /Open image/ }).first();
    await inspect.focus();
    await expect(inspect).toBeFocused();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Back to project' })).toBeFocused();
    await expect(dialog.locator('img')).toHaveAttribute('src', project.cover.src);
    await dialog.getByRole('button', { name: 'Actual size' }).click();
    await expect(dialog.locator('.native-size')).toBeVisible();
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(inspect).toBeFocused();
  }
  expect(await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).toMatchObject({ violations: [] });
  await page.getByRole('link', { name: 'Independent projects', exact: true }).click();
  await expect(page).toHaveURL(/\/#builds$/);
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title);
  expect(errors).toEqual([]);
});

test('external résumé is shared across header, hero, contact and mobile menu', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.locator('summary').click();
  for (const scope of [isMobile ? '.mobile-nav' : '.nav-resume', '.hero-actions', '#contact']) {
    const link = page.locator(scope).getByRole('link', { name: 'View résumé (opens in a new tab)', exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', profile.resume.href);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(link).not.toHaveAttribute('download');
  }
  await expect(page.locator('iframe, a[href="/resume/parneet-soni-resume.pdf"]')).toHaveCount(0);
  await page.goto('/work/uber-tasks');
  if (isMobile) await page.locator('summary').click();
  await expect(page.locator(isMobile ? '.mobile-nav' : '.nav-resume').getByRole('link', { name: /View résumé/ })).toHaveAttribute('href', profile.resume.href);
});

test('readable editorial projects and aligned contact/footer layout', async ({ page, isMobile }) => {
  await page.goto('/');
  for (const project of [...projects, ...builds]) {
    const card = page.locator('article').filter({ has: page.getByRole('heading', { name: project.title, exact: true }) });
    await expect(card.locator(`a[href="${projectPath(project)}"]`)).toHaveCount(1);
    await expect(card.getByRole('link', { name: new RegExp(project.category === 'employer' ? 'Read overview' : 'Read case study') })).toHaveAttribute('href', projectPath(project));
    expect(await card.locator(project.category === 'employer' ? '.work-role' : '.build-context>p').first().evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(14);
  }
  for (const icon of await page.locator('.link-icon').all()) expect(await icon.evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeLessThanOrEqual(18);
  await expect(page.getByText(/New ways to earn|Partnerships\. Greater reach|Less friction\. More progress/)).toHaveCount(0);
  const about = await page.locator('#about .about-copy').boundingBox();
  const contact = await page.locator('.contact-actions').boundingBox();
  expect(Math.abs(about!.x - contact!.x)).toBeLessThan(1);
  if (!isMobile) {
    const identity = await page.locator('.footer-identity').boundingBox();
    const back = await page.locator('footer.footer .text-link').boundingBox();
    expect(Math.abs(identity!.y + identity!.height / 2 - back!.y - back!.height / 2)).toBeLessThan(1);
  }
  if (!isMobile) {
    const before = await page.evaluate(() => ({ width: innerWidth, ratio: devicePixelRatio }));
    await page.keyboard.press('Meta+Equal');
    await page.keyboard.press('Meta+Equal');
    const after = await page.evaluate(() => ({ width: innerWidth, ratio: devicePixelRatio }));
    console.log('Browser zoom shortcut response:', { before, after });
    // Headless Chrome does not apply browser-toolbar shortcuts. Emulate 200% desktop
    // zoom with half the CSS viewport and twice the device scale, preserving reflow.
    await page.setViewportSize({ width: 720, height: 500 });
    const session = await page.context().newCDPSession(page);
    await session.send('Emulation.setDeviceMetricsOverride', { width: 720, height: 500, deviceScaleFactor: 2, mobile: false });
    expect(await page.evaluate(() => matchMedia('(max-width: 768px)').matches)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: 'output/playwright/content-polish/20260914/after-reflow-200-desktop.png', fullPage: true });
  }
});

test('editorial hierarchy brings the flagship into the first screen', async ({ page, isMobile }) => {
  await page.setViewportSize({ width: isMobile ? 390 : 1440, height: isMobile ? 844 : 900 });
  await page.goto('/');
  await expect(page.locator('.proof-strip, .project-card, .card-footer')).toHaveCount(0);
  const flagship = page.locator('.work-row').first();
  const title = await flagship.locator('h3').boundingBox();
  expect(title!.y + title!.height).toBeLessThan(isMobile ? 844 : 900);
  await expect(flagship.getByText('Revenue in three months', { exact: true })).toBeVisible();
  await expect(page.locator('.work-row')).toHaveCount(4);
  for (const row of await page.locator('.work-row').all()) {
    const context = await row.locator('.work-context').boundingBox();
    const narrative = await row.locator('.work-narrative').boundingBox();
    const evidence = await row.locator('.work-evidence').boundingBox();
    if (isMobile) {
      expect(context!.y + context!.height).toBeLessThan(narrative!.y);
      expect(narrative!.y + narrative!.height).toBeLessThan(evidence!.y);
    } else {
      expect(context!.x + context!.width).toBeLessThan(narrative!.x);
      expect(narrative!.x + narrative!.width).toBeLessThan(evidence!.x);
    }
  }
});

test('builds anchor is keyboard reachable and clears the sticky header', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.keyboard.press('Tab');
  if (isMobile) {
    await page.locator('summary').focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
  }
  const link = page.getByRole('navigation', { name: isMobile ? 'Mobile navigation' : 'Main navigation' }).getByRole('link', { name: 'Builds' });
  if (!isMobile) await link.focus();
  await expect(link).toBeFocused();
  expect(await link.evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#builds$/);
  if (isMobile) await expect(page.locator('details')).not.toHaveAttribute('open');
  const heading = await page.locator('#builds-heading').boundingBox();
  const header = await page.locator('.site-header').boundingBox();
  expect(heading!.y).toBeGreaterThanOrEqual(header!.height);
});
