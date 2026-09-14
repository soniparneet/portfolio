import { test, expect } from '@playwright/test';
import { builds } from '../src/content/builds';
import { projects } from '../src/content/projects';

test('VISUAL-001: narrow detail reuses approved text and preserves original-image access', async ({ page, isMobile }) => {
  const project = builds[1];
  for (const width of isMobile ? [375, 390] : [768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/builds/product-sense-practice');
    const excerpt = page.locator('.detail-readable-example');
    const image = page.locator('.project-lead-image>.project-figure>.image-inspect>img');
    if (width <= 768) {
      await expect(excerpt).toBeVisible();
      await expect(excerpt.locator('blockquote')).toHaveText(project.homepageExcerpt!.text);
      expect(await excerpt.locator('blockquote p').evaluate(n => parseFloat(getComputedStyle(n).fontSize))).toBeGreaterThanOrEqual(17);
      await expect(excerpt.getByText('User scope excerpt', { exact: true })).toBeVisible();
      await expect(excerpt.getByText('Example output - reformatted for readability.', { exact: true })).toBeVisible();
      await expect(excerpt.getByText(project.homepageExcerpt!.context)).toBeVisible();
      await expect(excerpt.getByText(project.homepageExcerpt!.attribution)).toBeVisible();
      await expect(excerpt.getByText('No Zerodha affiliation or hosted chatbot.')).toBeVisible();
      await expect(excerpt).not.toContainText('complete assumptions');
      await expect(image).toBeVisible();
    } else {
      await expect(excerpt).toBeHidden();
      await expect(image).toBeVisible();
    }
    const trigger = page.getByRole('button', { name: /Open image/ });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('img')).toHaveAttribute('src', project.cover!.src);
    await expect(dialog).toContainText(project.cover!.caption);
    await expect(dialog).toContainText('Owner-provided example');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('COPY-003: scope note sits with outcomes and contribution retains delivery/credits', async ({ page }) => {
  await page.goto('/work/oportun-verification');
  await expect(page.locator('.at-glance .outcome-note')).toHaveText(projects[2].outcomeNote!);
  await expect(page.locator('.at-glance .supporting-outcome + .outcome-note')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A focused operational improvement' })).toHaveCount(0);
  await expect(page.locator('.narrative')).not.toContainText(projects[2].outcomeNote!);
  await page.goto('/builds/product-sense-practice');
  await expect(page.locator('#built + p')).toContainText('I adapted the credited framework into reusable instructions, designed the interaction, refined the rules, and documented setup and limitations. It runs as an instruction-based experience inside ChatGPT, not as a separately hosted application or a trained model.');
  await expect(page.locator('.narrative')).toContainText('Ben Erez’s framework, published by Lenny’s Newsletter');
  await expect(page.locator('.narrative')).toContainText('These checks do not establish measured learning or hiring gains.');
});
