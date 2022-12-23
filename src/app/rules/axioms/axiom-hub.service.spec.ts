import { TestBed } from '@angular/core/testing';

import { instance } from 'ts-mockito';

import { AxiomHubService } from './axiom-hub.service';
import { ActivationAxiomService } from './activation.axiom.service';

import { mockedActivationAxiomService } from '../../../../tests/mocks';

describe('AxiomHubService', () => {
  let service: AxiomHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivationAxiomService,
          useValue: instance(mockedActivationAxiomService),
        },
      ],
    });
    service = TestBed.inject(AxiomHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
