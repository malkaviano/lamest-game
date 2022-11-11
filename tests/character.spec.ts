import { test, expect } from '@playwright/test';

const protocol = 'http';

const address = 'localhost:4200';

const endpoint = 'character-generation';

const characteristics = ['STR', 'CON', 'DEX', 'SIZ', 'INT', 'POW', 'APP'];

const identities = [
  'Name',
  'Profession',
  'Gender',
  'Age',
  'Race',
  'Height',
  'Weight',
];

test.beforeEach(async ({ page }) => {
  await page.goto(`${protocol}://${address}/${endpoint}`);
});

test.describe('Generating a random character', () => {
  test('New random characteristics', async ({ page }) => {
    for (const characteristic of characteristics) {
      const name = await page
        .locator(`data-testid=key-${characteristic}`)
        .textContent();

      expect(name).not.toBeNull();

      const value = await page
        .locator(`data-testid=value-${characteristic}`)
        .textContent();

      const num = parseInt(value || '0');

      expect(num).toBeGreaterThanOrEqual(8);
      expect(num).toBeLessThanOrEqual(18);
    }
  });

  test('New random identity', async ({ page }) => {
    for (const identity of identities) {
      const name = await page
        .locator(`data-testid=key-${identity}`)
        .textContent();

      expect(name).not.toBeNull();

      const value = await page
        .locator(`data-testid=value-${identity}`)
        .textContent();

      expect(value).not.toBeNull();
    }
  });
});
