import { TestBed } from '@angular/core/testing';

import { DodgeAxiomService } from './dodge.axiom.service';

describe('DodgeAxiomService', () => {
  let service: DodgeAxiomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DodgeAxiomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
