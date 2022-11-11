import { TestBed } from '@angular/core/testing';

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

  it('should generate random characteristics between 8 and 18', () => {
    const characteristics = service.characteristics();

    expect(characteristics.every((c) => c.value >= 8 && c.value <= 18)).toBe(
      true
    );
  });

  ['STR', 'CON', 'SIZ', 'DEX', 'INT', 'POW', 'APP'].forEach((name) => {
    it(`should generate ${name}`, () => {
      const characteristics = service.characteristics();

      expect(characteristics.some((c) => c.name === name)).toBe(true);
    });
  });
});
