import { TestBed } from '@angular/core/testing';

import { RulesHelper } from './rules.helper';

describe('RulesHelper', () => {
  let service: RulesHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RulesHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
