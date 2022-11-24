import { TestBed } from '@angular/core/testing';

import { UnequipRule } from './unequip.rule';

describe('UnequipRule', () => {
  let service: UnequipRule;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnequipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
