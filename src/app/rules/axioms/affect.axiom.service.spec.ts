import { TestBed } from '@angular/core/testing';

import { AffectAxiomService } from './affect.axiom.service';

describe('AffectedAxiomService', () => {
  let service: AffectAxiomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffectAxiomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
