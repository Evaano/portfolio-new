import { test, expect } from '@playwright/test';

test('deep links provide portfolio content and return to overview', async ({ page }) => {
  await page.goto('/#about');
  const about = page.getByRole('region', { name: /about me/i });
  await expect(about).toBeVisible();
  await expect(about.getByText(/Evan Rasheed/)).toBeVisible();
  await page.getByRole('button', { name: 'Back to overview' }).click();
  await expect(about).not.toBeVisible();
  await expect(page).toHaveURL(/#world/);
});

test('project details close independently and restore focus', async ({ page }) => {
  await page.goto('/#work');
  const work = page.getByRole('region', { name: /selected work/i });
  await expect(work).toBeVisible();
  const row = work.getByRole('button', { name: /Environment Intranet/i });
  await row.hover();
  await expect(row).toHaveCSS('background-image', /radial-gradient/);
  await page.getByRole('button', { name: 'Replay animation' }).click();
  await expect(page).toHaveURL(/#work$/);
  await row.click();
  const details = page.getByRole('dialog', { name: 'Environment Intranet' });
  await expect(details).toBeVisible();
  const screenshot = details.getByRole('img', { name: 'Environment Intranet interface' });
  await screenshot.hover();
  await expect(details.locator('.screenshot-lens')).toBeVisible();
  const zoom = details.getByRole('button', { name: 'Enlarge screenshot' });
  await zoom.focus();
  await page.keyboard.press('Enter');
  await expect(zoom).toHaveAttribute('aria-pressed', 'true');
  const preview = details.getByRole('region', { name: 'Environment Intranet screenshot preview' });
  expect(await preview.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  await page.keyboard.press('Enter');
  await expect(zoom).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Escape');
  await expect(details).not.toBeVisible();
  await expect(work).toBeVisible();
  await expect(row).toBeFocused();
  await page.getByRole('button', { name: 'Back to overview' }).click();
  await expect(work).not.toBeVisible();
});

test('contact provides working links and honest clipboard feedback', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#contact');
  const contact = page.getByRole('region', { name: /connect/i });
  await expect(contact.getByRole('link', { name: 'evaan0202@gmail.com' })).toHaveAttribute('href', 'mailto:evaan0202@gmail.com');
  await contact.getByRole('button', { name: 'Copy email' }).click();
  await expect(contact.getByRole('status')).toHaveText('Email copied to clipboard.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('evaan0202@gmail.com');
});

test('mobile interface and direct content fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#work');
  await expect(page.getByRole('region', { name: /selected work/i })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  await page.getByRole('button', { name: 'Back to overview' }).click();
  await expect(page.getByRole('link', { name: 'Overview', exact: true })).toBeVisible();
});
