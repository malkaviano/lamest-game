import { TestBed } from '@angular/core/testing';

import { MasterRuleService } from './master.rule.service';

describe('MasterRuleService', () => {
  let service: MasterRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
