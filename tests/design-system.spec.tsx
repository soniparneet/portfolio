import { test, expect } from '@playwright/test';
import { projects } from '../src/content/projects';
import { profile } from '../src/content/profile';

test('D02/D03: shared type, first baselines and second tracks survive wrapping', async ({ page, isMobile }) => {
  for (const width of isMobile ? [375, 390] : [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    for (const long of [false, true]) {
      if (long) await page.locator('.work-row').first().evaluate(row => {
        row.querySelector('h3')!.textContent = 'Launching a deliberately longer project title to test wrapping';
        row.querySelector('.work-role')!.textContent = 'Lead, Product & Strategy - Supply Operations and Regional Product Coordination';
      });
      const rows = await page.locator('.work-row').evaluateAll(rows => rows.map(row => {
        const company = row.querySelector('.work-company')!, title = row.querySelector('h3')!;
        // A zero-size inline probe measures the first text baseline, not the box top.
        function baseline(node: Element) {
          const marker = document.createElement('span');
          marker.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
          node.prepend(marker); const y = marker.getBoundingClientRect().top; marker.remove(); return y;
        }
        const style = getComputedStyle(title);
        const companyStyle = getComputedStyle(company);
        return {
          headingType: [style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight],
          companyType: [companyStyle.fontFamily, companyStyle.fontSize, companyStyle.fontWeight, companyStyle.lineHeight],
          type: [style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight, style.letterSpacing, style.color],
          baselineDifference: Math.abs(baseline(company) - baseline(title)),
          trackDifference: Math.abs(row.querySelector('.work-role')!.getBoundingClientRect().top - row.querySelector('.work-summary')!.getBoundingClientRect().top),
        };
      }));
      expect(new Set(rows.map(row => JSON.stringify(row.type))).size).toBe(1);
      for (const row of rows) expect(row.companyType).toEqual(row.headingType);
      if (width > 900) for (const row of rows) {
        expect(row.baselineDifference).toBeLessThanOrEqual(1);
        expect(row.trackDifference).toBeLessThanOrEqual(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

test('D05/D08/D09: static image opens by keyboard and both exits restore origin', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const trigger of await page.locator('#builds .image-inspect').all()) {
    await trigger.focus();
    const origin = await page.evaluate(() => scrollY);
    for (const exit of ['back', 'escape']) {
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog');
      const back = dialog.getByRole('button', { name: 'Back to portfolio' });
      await expect(back).toBeFocused();
      await dialog.getByRole('button', { name: 'Actual size' }).click();
      await expect(dialog.locator('.native-size')).toBeVisible();
      await dialog.evaluate(n => { n.scrollTop = n.scrollHeight; });
      expect((await back.boundingBox())!.y).toBeGreaterThanOrEqual((await dialog.boundingBox())!.y);
      await dialog.getByRole('button', { name: 'Fit image' }).click();
      const image = await dialog.locator('img').boundingBox();
      const frame = await dialog.locator('.image-dialog-scroll').boundingBox();
      expect(image!.height).toBeLessThanOrEqual(frame!.height + 1);
      expect(image!.width).toBeLessThanOrEqual(frame!.width + 1);
      await back.focus();
      await page.keyboard.press('Shift+Tab');
      expect(await dialog.evaluate(n => n.contains(document.activeElement))).toBe(true);
      if (exit === 'back') await back.click(); else await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      expect(Math.abs((await page.evaluate(() => scrollY)) - origin)).toBeLessThanOrEqual(1);
    }
  }
  await expect(page.locator('video, .practice-excerpt')).toHaveCount(0);
  await expect(page.locator('.image-affordance')).toHaveCount(0);
  await expect(page.getByText(/Enlarge image|＋/, { exact: true })).toHaveCount(0);
});

test('D05/D07: corrected active content and shared secondary action', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.locator('.hero-bottom>p')).toHaveText(profile.intro);
  await expect(page.locator('.about-copy')).toHaveText(profile.about);
  await expect(page.locator('.brand-mark')).toHaveText('ps');
  const home = page.getByRole('link', { name: 'Parneet Soni - home' });
  await home.hover();
  expect(await home.evaluate(n => getComputedStyle(n).textDecorationLine)).toBe('none');
  await page.keyboard.press('Tab'); await home.focus();
  expect(await home.evaluate(n => getComputedStyle(n).outlineStyle)).not.toBe('none');
  if (isMobile) await page.locator('summary').click();
  for (const scope of [isMobile ? '.mobile-nav' : '.nav-resume', '.hero-actions']) {
    await expect(page.locator(scope).getByRole('link', { name: /View résumé/ })).toHaveClass(/button-secondary/);
  }
  const heights = await page.locator('.hero-actions>a').evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().height));
  expect(heights[0]).toBe(heights[1]); expect(heights[0]).toBeGreaterThanOrEqual(48);
  for (const route of ['/', ...projects.map(p => `/work/${p.slug}`), '/builds/citizen-sir-watch', '/builds/product-sense-practice']) {
    await page.goto(route);
    await expect(page.locator('main')).not.toContainText(/100M|₹80|Lead - Personal Loans|Associate Vice President|Shorter verification cycle|Approvals automated|Document-verification and lending operations work|Dollar amounts in US dollars\.|—|Product Sense Practice/);
  }
  for (const project of projects) {
    await page.goto(`/work/${project.slug}`);
    await expect(page.locator('.project-role')).toHaveText(project.role);
    const grid = await page.locator('.at-glance .outcome-grid').boundingBox();
    const metric = await page.locator('.at-glance .outcome-grid>div').boundingBox();
    expect(Math.abs(grid!.width - metric!.width)).toBeLessThanOrEqual(1);
    for (const metric of project.outcomes) await expect(page.locator('.at-glance')).toContainText(metric.statement || metric.value);
  }
});

test('seven corrections: paired tracks and shared split-section anchors', async ({ page, isMobile }) => {
  for (const width of isMobile ? [375, 390] : [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const cards = page.locator('.independent-project');
    for (const img of await cards.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(n => (n as HTMLImageElement).decode());
    }
    const tracks = ['.build-identity h3', '.build-identity>p', '.image-inspect', '.build-context', '.story-link', '.project-actions'];
    for (const selector of tracks) {
      const a = (await cards.nth(0).locator(selector).boundingBox())!;
      const b = (await cards.nth(1).locator(selector).boundingBox())!;
      if (width > 800) {
        expect(Math.abs(a.y - b.y), selector).toBeLessThanOrEqual(1);
        if (selector === '.image-inspect') {
          expect(Math.abs(a.y + a.height - b.y - b.height)).toBeLessThanOrEqual(1);
          expect(Math.abs(a.width - b.width)).toBeLessThanOrEqual(1);
          expect(Math.abs(a.width / a.height - 16 / 9)).toBeLessThan(0.01);
        }
      } else expect(b.y).toBeGreaterThan(a.y + a.height);
    }
    const experience = (await page.locator('.experience-list').boundingBox())!;
    const about = (await page.locator('.about-copy').boundingBox())!;
    expect(Math.abs(experience.x - about.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(experience.x + experience.width - about.x - about.width)).toBeLessThanOrEqual(1);
    const headings = await page.locator('#experience h2, #about h2').evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().x));
    expect(Math.abs(headings[0] - headings[1])).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('seven corrections: exactly one labeled primary result and supporting bullet per row', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-bottom>p')).toHaveText('I’m Parneet. I’ve launched a new way for driver-partners to earn at Uber, scaled lending partnerships at Oportun, and led customer service, platform products, and tutor marketplace at BYJU’S.');
  await expect(page.locator('.work-outcome')).toHaveCount(4);
  for (const [index, row] of (await page.locator('.work-row').all()).entries()) {
    const p = projects[index];
    await expect(row.locator('.work-outcome dd')).toHaveText(p.outcomes[0].value);
    await expect(row.locator('.work-outcome dt')).toHaveText(p.homepageOutcome?.label || p.outcomes[0].label);
    await expect(row.locator('.work-outcome li')).toHaveCount(1);
    await expect(row.locator('.work-outcome li')).toHaveText(p.homepageOutcome!.supportingPoint);
    await expect(row.locator('.work-outcome>.story-link')).toHaveCount(1);
    await expect(row.locator('.work-evidence .metric-context, .work-evidence p')).toHaveCount(0);
  }
  await expect(page.locator('.build-context>p')).toHaveText([
    'Independent web tool. Limited Karnataka coverage; not an official government service.',
    'AI instruction workflow. Framework: Ben Erez / Lenny’s Newsletter.',
  ]);
  for (const trigger of await page.locator('#builds .image-inspect').all()) {
    await trigger.focus();
    expect(await trigger.evaluate(n => getComputedStyle(n).cursor)).toBe('zoom-in');
    expect(await trigger.evaluate(n => getComputedStyle(n).outlineStyle)).not.toBe('none');
    await expect(trigger.locator('button, a, .image-affordance')).toHaveCount(0);
  }
});
