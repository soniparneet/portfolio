import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('skip link stays keyboard-accessible on screen and never prints, even focused', async ({ page }, testInfo) => {
  await page.goto('/');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  const box = await skip.boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(0);
  expect(await skip.evaluate(n => getComputedStyle(n).clipPath)).toBe('inset(50%)');
  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  expect((await skip.boundingBox())!.y).toBeGreaterThanOrEqual(0);
  expect(await skip.evaluate(n => getComputedStyle(n).clipPath)).toBe('none');
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  for (const focused of [false, true]) {
    await page.goto('/');
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(n => (n as HTMLImageElement).decode());
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    if (focused) await page.keyboard.press('Tab');
    await page.emulateMedia({ media: 'print' });
    await expect(skip).toBeHidden();
    await expect(page.locator('.mobile-nav')).toBeHidden();
    await expect(page.locator('footer.footer > a')).toBeHidden();
    for (const control of await page.locator('.image-affordance').all()) await expect(control).toBeHidden();
    for (const image of await page.locator('.image-inspect img').all()) await expect(image).toBeVisible();
    expect(await page.locator('.site-header').evaluate(n => getComputedStyle(n).position)).toBe('static');
    await expect(page.locator('.nav-resume a')).toBeVisible();
    await expect(page.locator('#builds .story-link').first()).toBeVisible();
    for (const image of await page.locator('.project-figure img').all()) {
      const dimensions = await image.evaluate(n => ({ image: n.getBoundingClientRect().width, frame: n.parentElement!.getBoundingClientRect().width }));
      expect(dimensions.image).toBeLessThanOrEqual(dimensions.frame + 1);
    }
    if (testInfo.project.name === 'desktop') {
      await mkdir('output/playwright/content-polish/20260914', { recursive: true });
      for (const image of await page.locator('img').all()) await image.evaluate(n => (n as HTMLImageElement).decode());
      await page.pdf({ path: `output/playwright/content-polish/20260914/print-smoke-home${focused ? '-focused' : ''}.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true });
    }
    await page.emulateMedia({ media: 'screen' });
  }
});

test('project identity precedes compact preview; reviewed image is independent of a demo', async ({ page }) => {
  await page.goto('/');
  for (const card of await page.locator('#builds article').all()) {
    const heading = await card.locator('h3').boundingBox();
    const preview = await card.locator('.build-preview').boundingBox();
    expect(heading!.y + heading!.height).toBeLessThan(preview!.y);
  }
  const practice = page.locator('#builds article').filter({ hasText: 'AI Skill: PM Interviewer' });
  await expect(practice.locator('img')).toHaveCount(1);
  await expect(practice.locator('blockquote')).toHaveCount(0);
  await expect(practice.locator('.build-context')).toHaveText('AI instruction workflow. Framework: Ben Erez / Lenny’s Newsletter.');
  await expect(practice.getByText(/Ben Erez \/ Lenny’s Newsletter/)).toBeVisible();
  const citizen = page.locator('#builds article').filter({ hasText: 'Citizen SIR Watch' });
  await expect(citizen.locator('img')).toHaveCount(1);
  await expect(citizen.getByRole('button', { name: /Open image/ })).toBeVisible();
  await expect(practice.getByRole('link', { name: /live app|prototype/i })).toHaveCount(0);
  await expect(page.locator('#builds').getByText(/Captured 13 September|Original public-product screenshot/)).toHaveCount(0);
});
