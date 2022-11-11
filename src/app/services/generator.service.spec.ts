import { TestBed } from '@angular/core/testing';

import { ages } from '../literals/age.literal';
import { genders } from '../literals/gender.literal';
import { heights } from '../literals/height.literal';
import { professions } from '../literals/profession.literal';
import { races } from '../literals/race.literal';
import { weights } from '../literals/weight.literal';

import { GeneratorService } from './generator.service';

describe('GeneratorService', () => {
  let service: GeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generating random characteristics', () => {
    it('should generate random characteristics between 8 and 18', () => {
      const characteristics = service.characteristics();

      expect(
        characteristics.every(
          (c) => parseInt(c.value) >= 8 && parseInt(c.value) <= 18
        )
      ).toBe(true);
    });

    ['STR', 'CON', 'SIZ', 'DEX', 'INT', 'POW', 'APP'].forEach((name) => {
      it(`should generate random ${name}`, () => {
        const characteristics = service.characteristics();

        expect(characteristics.some((c) => c.key === name)).toBe(true);
      });
    });
  });

  describe('generating random identity', () => {
    it('should generate random height', () => {
      const result = randomChecker(heights, () => service.height());

      expect(result).toBe(true);
    });

    it('should generate random weight', () => {
      const result = randomChecker(weights, () => service.weight());

      expect(result).toBe(true);
    });

    it('should generate random age', () => {
      const result = randomChecker(ages, () => service.age());

      expect(result).toBe(true);
    });

    it('should generate random gender', () => {
      const result = randomChecker(genders, () => service.gender());

      expect(result).toBe(true);
    });

    it('should generate random race', () => {
      const result = randomChecker(races, () => service.race());

      expect(result).toBe(true);
    });

    it('should generate random profession', () => {
      const result = randomChecker(professions, () => service.profession());

      expect(result).toBe(true);
    });

    it('should generate random name', () => {
      const result = service.name().split(' ').length;

      expect(result).toBe(2);
    });
  });
});

const randomChecker = (keys: string[], f: () => string): boolean => {
  const samples = keys.length * 5;

  const results: any = {};

  for (let index = 0; index < samples; index++) {
    const r = f();

    results[r] = true;
  }

  let result = true;

  for (const key of keys) {
    result = result && results[key];
  }

  return result && !!!results['undefined'];
};
