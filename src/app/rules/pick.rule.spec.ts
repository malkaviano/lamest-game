import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, verify, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { PickRule } from './pick.rule';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ExtractorHelper } from '../helpers/extractor.helper';

import {
  mockedExtractorHelper,
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionPickSimpleSword,
  interactiveInfo,
  playerInfo,
  simpleSword,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('PickRule', () => {
  let service: PickRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(PickRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should log item picked', (done) => {
      when(
        mockedExtractorHelper.extractItemOrThrow(
          instance(mockedInventoryService),
          eventPickSimpleSword.eventId,
          eventPickSimpleSword.actionableDefinition.name
        )
      ).thenReturn(simpleSword);

      when(
        mockedInteractiveEntity.reactTo(
          eventPickSimpleSword.actionableDefinition,
          'NONE',
          deepEqual({})
        )
      ).thenReturn(itemTookMessage);

      ruleScenario(
        service,
        actor,
        eventPickSimpleSword,
        {
          target: instance(mockedInteractiveEntity),
        },
        [itemTookLog],
        done
      );

      // Cheap side effect check, instead of another test case
      verify(mockedInventoryService.store(actor.id, simpleSword)).once();
    });
  });
});

const actor = instance(mockedPlayerEntity);

const itemTookMessage = `${interactiveInfo.name}-${simpleSword.identity.label}`;

const itemTookLog = new LogMessageDefinition(
  'TOOK',
  playerInfo.name,
  'took test-Sword from test'
);

const eventPickSimpleSword = actionableEvent(
  actionPickSimpleSword,
  interactiveInfo.id
);
