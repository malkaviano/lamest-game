import { TestBed } from '@angular/core/testing';

import { ReadAxiomService } from './read.axiom.service';

describe('ReadAxiomService', () => {
  let service: ReadAxiomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadAxiomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
