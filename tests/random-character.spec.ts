import { test, expect } from '@playwright/test';

import { characteristicsDefinitions } from '../src/app/definitions/characteristics.definition';
import { characterIdentityDefinitions } from '../src/app/definitions/character-identity.definition';
import { derivedAttributeDefinitions } from '../src/app/definitions/attributes.definition';
import {
  commonSkillDefinitions,
  skillDefinitions,
} from '../src/app/definitions/skill.definition';
import { SkillNameLiteral } from '../src/app/literals/skill-name.literal';
import { professionSkillDefinitions } from '../src/app/definitions/profession.definition';
import { ProfessionLiteral } from '../src/app/literals/profession.literal';

const protocol = 'http';

const address = 'localhost:4200';

const endpoint = 'character-generation';

test.beforeEach(async ({ page }) => {
  await page.goto(`${protocol}://${address}/${endpoint}`);
});

test.describe('Generating a random character', () => {
  test('Characteristics', async ({ page }) => {
    for (const key in characteristicsDefinitions) {
      if (
        Object.prototype.hasOwnProperty.call(characteristicsDefinitions, key)
      ) {
        const name = await page
          .locator(`data-testid=key-${key.toUpperCase()}`)
          .textContent();

        expect(name).not.toBeNull();

        const value = await page
          .locator(`data-testid=value-${key.toUpperCase()}`)
          .textContent();

        const num = parseInt(value || '0');

        expect(num).toBeGreaterThanOrEqual(8);
        expect(num).toBeLessThanOrEqual(18);
      }
    }
  });

  test('Identity', async ({ page }) => {
    for (const key in characterIdentityDefinitions) {
      if (
        Object.prototype.hasOwnProperty.call(characterIdentityDefinitions, key)
      ) {
        const name = await page
          .locator(`data-testid=key-${key.toUpperCase()}`)
          .textContent();

        expect(name).not.toBeNull();

        const value = await page
          .locator(`data-testid=value-${key.toUpperCase()}`)
          .textContent();

        expect(value).not.toBeNull();
      }
    }
  });

  test('Derived attibutes', async ({ page }) => {
    for (const key in derivedAttributeDefinitions) {
      if (
        Object.prototype.hasOwnProperty.call(derivedAttributeDefinitions, key)
      ) {
        const name = await page
          .locator(`data-testid=key-${key.toUpperCase()}`)
          .textContent();

        expect(name).not.toBeNull();

        const value = await page
          .locator(`data-testid=value-${key.toUpperCase()}`)
          .textContent();

        expect(value).not.toBeNull();
      }
    }
  });

  test('Skill', async ({ page }) => {
    const profession = await page
      .locator(`data-testid=value-PROFESSION`)
      .textContent();

    const professionSkills =
      professionSkillDefinitions[profession as ProfessionLiteral];

    for (const key of professionSkills.keyValues.concat(
      commonSkillDefinitions.keyValues
    )) {
      const name = await page.locator(`data-testid=key-${key}`).textContent();

      expect(name).not.toBeNull();

      const value = await page
        .locator(`data-testid=value-${key}`)
        .textContent();

      expect(value).not.toBeNull();
    }
  });
});
