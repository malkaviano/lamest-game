import { TestBed } from '@angular/core/testing';

import { instance } from 'ts-mockito';

import { EventHubHelperService } from './event-hub.helper.service';
import { RollService } from '../services/roll.service';
import { RuleDispatcherService } from '../services/rule-dispatcher.service';
import { DodgeAxiomService } from '../axioms/dodge.axiom.service';
import { ActivationAxiomService } from '../axioms/activation.axiom.service';
import { AffectAxiomService } from '../axioms/affect.axiom.service';
import { ReadAxiomService } from '../axioms/read.axiom.service';

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
          provide: DodgeAxiomService,
          useValue: instance(mockedDodgeAxiomService),
        },
        {
          provide: ActivationAxiomService,
          useValue: instance(mockedActivationAxiomService),
        },
        {
          provide: AffectAxiomService,
          useValue: instance(mockedAffectedAxiomService),
        },
        {
          provide: ReadAxiomService,
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
