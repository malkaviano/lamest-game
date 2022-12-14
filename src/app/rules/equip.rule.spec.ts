import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import {
  createEquipErrorLogMessage,
  createEquippedLogMessage,
  createUnEquippedLogMessage,
} from '../definitions/log-message.definition';
import { InventoryService } from '../services/inventory.service';
import { ItemStore } from '../stores/item.store';
import { EquipRule } from './equip.rule';

import {
  mockedInventoryService,
  mockedItemStore,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionEquip,
  greatSword,
  simpleSword,
} from '../../../tests/fakes';

describe('EquipRule', () => {
  let service: EquipRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: ItemStore,
          useValue: instance(mockedItemStore),
        },
      ],
    });

    setupMocks();

    when(mockedPlayerEntity.equip(simpleSword)).thenReturn(simpleSword);

    when(mockedItemStore.itemSkill(eventOk.eventId)).thenReturn(
      'Melee Weapon (Simple)'
    );

    when(mockedItemStore.itemSkill(eventNoSkill.eventId)).thenReturn(
      'Melee Weapon (Great)'
    );

    when(mockedItemStore.itemLabel(eventNoSkill.eventId)).thenReturn(
      greatSword.identity.label
    );

    service = TestBed.inject(EquipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when skill value is above 0', () => {
      it('return logs', () => {
        when(mockedPlayerEntity.equip(simpleSword)).thenReturn(null);

        when(mockedInventoryService.take('player', 'sword')).thenReturn(
          simpleSword
        );

        const result = service.execute(instance(mockedPlayerEntity), eventOk);

        expect(result).toEqual({
          logs: [logEquip],
        });
      });
    });

    describe('when a previous weapon was equipped', () => {
      it('return logs', () => {
        when(
          mockedInventoryService.take('player', simpleSword.identity.name)
        ).thenReturn(simpleSword);

        const result = service.execute(instance(mockedPlayerEntity), eventOk);

        expect(result).toEqual({
          logs: [logUnEquip, logEquip],
        });
      });

      it('should store previous weapon', () => {
        let result = 0;

        when(
          mockedInventoryService.take('player', simpleSword.identity.name)
        ).thenReturn(simpleSword);

        when(mockedInventoryService.store('player', simpleSword)).thenCall(
          () => (result = 1)
        );

        service.execute(instance(mockedPlayerEntity), eventOk);

        expect(result).toEqual(1);
      });
    });

    describe('when skill value is 0', () => {
      it('return logs', () => {
        const result = service.execute(
          instance(mockedPlayerEntity),
          eventNoSkill
        );

        expect(result).toEqual({
          logs: [logError],
        });
      });
    });
  });
});

const eventOk = actionableEvent(actionEquip, simpleSword.identity.name);

const eventNoSkill = actionableEvent(actionEquip, greatSword.identity.name);

const logEquip = createEquippedLogMessage('player', simpleSword.identity.label);

const logUnEquip = createUnEquippedLogMessage(
  'player',
  simpleSword.identity.label
);

const logError = createEquipErrorLogMessage(
  'player',
  greatSword.skillName,
  greatSword.identity.label
);
