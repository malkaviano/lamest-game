import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { UnEquipRule } from './unequip.rule';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { ActionableEvent } from '../events/actionable.event';
import { LogMessageDefinition } from '../definitions/log-message.definition';

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
import { ruleScenario } from '../../../tests/scenarios';

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

    service = TestBed.inject(UnEquipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log weapon unequipped', () => {
    when(
      mockedStringMessagesStoreService.createUnEquippedLogMessage(
        playerInfo.name,
        unDodgeableAxe.identity.label
      )
    ).thenReturn(unEquippedLog);

    when(mockedPlayerEntity.unEquip()).thenReturn(unDodgeableAxe);

    ruleScenario(service, instance(mockedPlayerEntity), unEquipEvent, {}, [
      unEquippedLog,
    ]);
  });
});

const unEquippedLog = new LogMessageDefinition(
  'UNEQUIPPED',
  playerInfo.name,
  unDodgeableAxe.identity.label
);

const unEquipAction = actionUnEquip(unDodgeableAxe.identity.label);

const unEquipEvent = new ActionableEvent(
  unEquipAction,
  unDodgeableAxe.identity.name
);
