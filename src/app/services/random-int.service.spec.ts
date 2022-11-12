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
