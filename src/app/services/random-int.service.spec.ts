import { TestBed } from '@angular/core/testing';

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
      const results: { [key: number]: boolean } = {};

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
});
