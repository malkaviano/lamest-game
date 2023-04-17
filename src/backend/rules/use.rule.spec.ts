import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { UseRule } from './use.rule';
import { AffectAxiom } from '../axioms/affect.axiom';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { CheckedService } from '../services/checked.service';

import {
  mockedAffectedAxiomService,
  mockedCheckedService,
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  playerInfo,
  interactiveInfo,
  actionUseMasterKey,
  masterKey,
  actionableEvent,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('UseRule', () => {
  let service: UseRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: CheckedService,
          useValue: instance(mockedCheckedService),
        },
        {
          provide: AffectAxiom,
          useValue: instance(mockedAffectedAxiomService),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(UseRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item could not be found', () => {
      it('should log item not found', (done) => {
        ruleScenario(
          service,
          actor,
          eventUseMasterKey,
          extras,
          [notFoundLog],
          done
        );
      });
    });

    describe('when item could be found', () => {
      it('should log item lost', (done) => {
        when(
          mockedInventoryService.take(playerInfo.id, masterKey.identity.name)
        ).thenReturn(masterKey);

        ruleScenario(
          service,
          actor,
          eventUseMasterKey,
          extras,
          [itemLostLog],
          done
        );
      });
    });
  });
});

const notFoundLog = new LogMessageDefinition(
  'NOT-FOUND',
  playerInfo.name,
  'Master Key failed, required item was not found in inventory'
);

const itemLostLog = new LogMessageDefinition(
  'LOST',
  playerInfo.name,
  'lost Master Key'
);

const eventUseMasterKey = actionableEvent(
  actionUseMasterKey,
  interactiveInfo.id
);

const actor = instance(mockedPlayerEntity);

const extras = {
  target: instance(mockedInteractiveEntity),
};
