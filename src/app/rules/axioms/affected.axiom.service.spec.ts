import { TestBed } from '@angular/core/testing';

import { AffectedAxiomService } from './affected.axiom.service';

describe('AffectedAxiomService', () => {
  let service: AffectedAxiomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffectedAxiomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
