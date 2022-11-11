import { test, expect } from '@playwright/test';

const protocol = 'http';

const address = 'localhost:4200';

const endpoint = 'character-generation';

const characteristics = ['STR', 'CON', 'DEX', 'SIZ', 'INT', 'POW', 'APP'];

test.beforeEach(async ({ page }) => {
  await page.goto(`${protocol}://${address}/${endpoint}`);
});

test.describe('Generating a random character', () => {
  test('New random characteristics', async ({ page }) => {
    for (const characteristic of characteristics) {
      const name = await page
        .locator(`data-testid=name-${characteristic}`)
        .textContent();

      expect(name).not.toBeNull();

      const description = await page
        .locator(`data-testid=description-${characteristic}`)
        .textContent();

      expect(description).not.toBeNull();

      const value = await page
        .locator(`data-testid=value-${characteristic}`)
        .textContent();

      const num = parseInt(value || '0');

      expect(num).toBeGreaterThanOrEqual(8);
      expect(num).toBeLessThanOrEqual(18);
    }
  });
});
