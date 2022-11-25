import { TestBed } from '@angular/core/testing';

import { AttackRule } from './attack.rule';

describe('AttackRule', () => {
  let service: AttackRule;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttackRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
