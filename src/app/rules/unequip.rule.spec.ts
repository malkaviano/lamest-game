import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { UnEquipRule } from './unequip.rule';

import { StringMessagesStoreService } from '../stores/string-messages.store.service';

import {
  mockedPlayerEntity,
  mockedInventoryService,
  setupMocks,
  mockedStringMessagesStoreService,
} from '../../../tests/mocks';
import {
  actionUnEquip,
  playerInfo,
  unDodgeableAxe,
} from '../../../tests/fakes';
import { LogMessageDefinition } from '../definitions/log-message.definition';

describe('UnEquipRule', () => {
  let service: UnEquipRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: StringMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(
      mockedStringMessagesStoreService.createUnEquippedLogMessage(
        playerInfo.name,
        unDodgeableAxe.identity.label
      )
    ).thenReturn(log);

    service = TestBed.inject(UnEquipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      when(
        mockedInventoryService.store(playerInfo.id, unDodgeableAxe)
      ).thenReturn(1);

      when(mockedPlayerEntity.unEquip()).thenReturn(unDodgeableAxe);

      const logs = service.execute(
        instance(mockedPlayerEntity),
        new ActionableEvent(
          actionUnEquip(unDodgeableAxe.identity.label),
          unDodgeableAxe.identity.name
        )
      );

      expect(logs).toEqual({});
    });
  });
});

const log = new LogMessageDefinition(
  'UNEQUIPPED',
  playerInfo.name,
  unDodgeableAxe.identity.label
);
