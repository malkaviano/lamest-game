import { TestBed } from '@angular/core/testing';

import { instance } from 'ts-mockito';

import { RuleDispatcherService } from '../services/rule-dispatcher.service';
import { LoggingHubHelperService } from './logging-hub.helper.service';
import { ActivationAxiomService } from '../rules/axioms/activation.axiom.service';

import {
  mockedActivationAxiomService,
  mockedRuleDispatcherService,
} from '../../../tests/mocks';

describe('LoggingHubHelperService', () => {
  let service: LoggingHubHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RuleDispatcherService,
          useValue: instance(mockedRuleDispatcherService),
        },
        {
          provide: ActivationAxiomService,
          useValue: instance(mockedActivationAxiomService),
        },
      ],
    });
    service = TestBed.inject(LoggingHubHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
