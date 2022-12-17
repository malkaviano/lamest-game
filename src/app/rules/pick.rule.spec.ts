import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, verify, when } from 'ts-mockito';

import { createTookLogMessage } from '../definitions/log-message.definition';
import { InventoryService } from '../services/inventory.service';
import { PickRule } from './pick.rule';

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
import { ExtractorHelper } from '../helpers/extractor.helper';

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
    it('return logs', () => {
      when(
        mockedInteractiveEntity.reactTo(
          actionPickSimpleSword,
          'NONE',
          deepEqual({})
        )
      ).thenReturn(simpleSword.identity.label);

      when(
        mockedExtractorHelper.extractItemOrThrow(
          instance(mockedInventoryService),
          eventPickSimpleSword.eventId,
          simpleSword.identity.name
        )
      ).thenReturn(simpleSword);

      const result = service.execute(
        instance(mockedPlayerEntity),
        eventPickSimpleSword,
        { target: instance(mockedInteractiveEntity) }
      );

      verify(mockedInventoryService.store(playerInfo.id, simpleSword)).once();

      expect(result).toEqual({
        logs: [log],
      });
    });
  });
});

const log = createTookLogMessage(
  playerInfo.name,
  interactiveInfo.name,
  simpleSword.identity.label
);

const eventPickSimpleSword = actionableEvent(
  actionPickSimpleSword,
  interactiveInfo.id
);
