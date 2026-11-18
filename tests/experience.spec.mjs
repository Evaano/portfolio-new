import { test, expect } from '@playwright/test';

test('character model loads and navigation opens the selected section', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const model = page.waitForResponse(response => response.url().includes('/models/character.vrm') && response.ok());
  await page.goto('/#world');
  await model;
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Overview', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Explore selected work' }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole('region', { name: /selected work/i })).toBeVisible();
  await page.getByRole('button', { name: 'Back to overview' }).click();
  await expect(page).toHaveURL(/#world$/);
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole('region', { name: /about me/i })).toBeVisible();
  expect(errors).toEqual([]);
});

test('back and forward restore sections and selected navigation', async ({ page }) => {
  await page.goto('/#world');
  await page.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('region', { name: /connect/i })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('region', { name: /connect/i })).toBeHidden();
  await expect(page.getByRole('link', { name: 'Overview', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.goForward();
  await expect(page.getByRole('region', { name: /connect/i })).toBeVisible();
});

test('portfolio remains accessible without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return original.call(this, type, ...args);
    };
  });
  await page.goto('/#world');
  await expect(page.getByText(/character preview unavailable/i)).toBeVisible();
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('region', { name: /about me/i })).toBeVisible();
});
