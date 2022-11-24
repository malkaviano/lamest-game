import { TestBed } from '@angular/core/testing';

import { EquipRule } from './equip.rule';

describe('EquipRule', () => {
  let service: EquipRule;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
