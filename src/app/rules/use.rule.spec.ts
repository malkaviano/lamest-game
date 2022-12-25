import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { UseRule } from './use.rule';
import { CheckedHelper } from '../helpers/checked.helper';
import { AffectAxiomService } from '../axioms/affect.axiom.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';

import {
  mockedAffectedAxiomService,
  mockedExtractorHelper,
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
          provide: CheckedHelper,
          useValue: instance(mockedExtractorHelper),
        },
        {
          provide: AffectAxiomService,
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
