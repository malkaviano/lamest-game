import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { InspectRule } from './inspect.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { ReadAxiom } from '../../core/axioms/read.axiom';

import {
  mockedInventoryService,
  mockedPlayerEntity,
  mockedReadAxiomService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionInspect,
  playerInfo,
  readable,
  simpleSword,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('InspectRule', () => {
  let service: InspectRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: ReadAxiom,
          useValue: instance(mockedReadAxiomService),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(InspectRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item could not be found', () => {
      it('throw Wrong item was used', () => {
        when(
          mockedInventoryService.look(playerInfo.id, eventInspectWrong.eventId)
        ).thenReturn(null);

        expect(() =>
          service.execute(instance(mockedPlayerEntity), eventInspectWrong)
        ).toThrowError(GameStringsStore.errorMessages['WRONG-ITEM']);
      });
    });

    describe('item was found', () => {
      it('should log item was inspected', (done) => {
        when(
          mockedInventoryService.look(
            playerInfo.id,
            eventInspectReadable.eventId
          )
        ).thenReturn(readable);

        ruleScenario(
          service,
          actor,
          eventInspectReadable,
          {},
          [itemInspectedLog],
          done
        );
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const eventInspectReadable = actionableEvent(
  actionInspect,
  readable.identity.name
);

const eventInspectWrong = actionableEvent(
  actionInspect,
  simpleSword.identity.name
);

const itemInspectedLog = new LogMessageDefinition(
  'INSPECTED',
  playerInfo.name,
  'inspected Book'
);