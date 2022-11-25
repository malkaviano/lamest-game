import { TestBed } from '@angular/core/testing';

import { DefenseRule } from './defense.rule';

describe('DefenseRule', () => {
  let service: DefenseRule;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefenseRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
