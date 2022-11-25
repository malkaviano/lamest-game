import { TestBed } from '@angular/core/testing';
import { RollDefinition } from '../definitions/roll.definition';
import { ResultLiteral } from '../literals/result.literal';

import { RandomIntService } from './random-int.service';

describe('RandomIntService', () => {
  let service: RandomIntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomIntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRandomInterval', () => {
    it('should generate numbers between 0 and 100', () => {
      const results: any = {};

      for (let index = 0; index < 500; index++) {
        const element = service.getRandomInterval(0, 100);

        results[element] = true;
      }

      let final = true;

      for (const key in results) {
        final = final && (results[key] ?? false);
      }

      expect(final).toBe(true);
    });
  });

  describe('roll', () => {
    it('return summed result', () => {
      const result = service.roll({
        D4: 1,
        D6: 1,
        D8: 1,
        D10: 1,
        D12: 1,
        D20: 1,
        D100: 1,
      });

      expect(result).toBeGreaterThan(7);
      expect(result).toBeLessThanOrEqual(160);
    });
  });

  describe('checkSkill', () => {
    describe('when skill value was 0', () => {
      it('return failure without roll value', () => {
        const result = service.checkSkill(0);

        expect(result).toEqual(new RollDefinition('FAILURE'));
      });
    });

    describe('when skill value was above 0', () => {
      describe('when roll is superior skill value', () => {
        it('return result and roll value', () => {
          const result = new Set<ResultLiteral>();

          for (let index = 0; index < 10; index++) {
            result.add(service.checkSkill(50).result);
          }

          const expected = new Set<ResultLiteral>();

          expected.add('FAILURE');
          expected.add('SUCCESS');

          expect(result).toEqual(expected);
        });
      });
    });
  });
});
