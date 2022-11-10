import { test, expect, type Page, Locator } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
});

test.describe('Interacting with my bed', () => {
  test('Making my bed', async ({ page }) => {
    await page.locator('#make_bed1').click();

    const snackBar = page.locator('simple-snack-bar >> text=make_bed1');

    await interaction(page, snackBar);
  });

  test('Changing bedclothes', async ({ page }) => {
    await page.locator('#make_bed2').click();

    const snackBar = page.locator('simple-snack-bar >> text=make_bed2');

    await interaction(page, snackBar);
  });
});

const interaction = async (page: Page, locator: Locator) => {
  await expect(locator).toBeVisible();

  await page.locator('button >> text=dismiss').click();

  await expect(locator).toBeHidden();
};
