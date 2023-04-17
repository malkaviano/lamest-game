import { TestBed } from '@angular/core/testing';

import { instance } from 'ts-mockito';

import { EventHubHelperService } from './event-hub.helper';
import { RollService } from '../services/roll.service';
import { RuleDispatcherService } from '../services/rule-dispatcher.service';
import { DodgeAxiom } from '../axioms/dodge.axiom';
import { ActivationAxiom } from '../axioms/activation.axiom';
import { AffectAxiom } from '../axioms/affect.axiom';
import { ReadAxiom } from '../axioms/read.axiom';

import {
  mockedActivationAxiomService,
  mockedAffectedAxiomService,
  mockedDodgeAxiomService,
  mockedReadAxiomService,
  mockedRollService,
  mockedRuleDispatcherService,
} from '../../../tests/mocks';

describe('EventHubHelperService', () => {
  let service: EventHubHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RollService,
          useValue: instance(mockedRollService),
        },
        {
          provide: RuleDispatcherService,
          useValue: instance(mockedRuleDispatcherService),
        },
        {
          provide: DodgeAxiom,
          useValue: instance(mockedDodgeAxiomService),
        },
        {
          provide: ActivationAxiom,
          useValue: instance(mockedActivationAxiomService),
        },
        {
          provide: AffectAxiom,
          useValue: instance(mockedAffectedAxiomService),
        },
        {
          provide: ReadAxiom,
          useValue: instance(mockedReadAxiomService),
        },
      ],
    });
    service = TestBed.inject(EventHubHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
