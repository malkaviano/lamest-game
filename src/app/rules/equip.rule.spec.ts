import { TestBed } from '@angular/core/testing';

import { instance, mock, reset, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import {
  createEquipErrorLogMessage,
  createEquippedLogMessage,
  createUnEquippedLogMessage,
} from '../definitions/log-message.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { PlayerEntity } from '../entities/player.entity';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { ItemStore } from '../stores/item.store';
import { EquipRule } from './equip.rule';

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

    reset(mockedInventoryService);

    reset(mockedItemStore);

    when(mockedCharacterEntity.skills).thenReturn({ 'Artillery (War)': 45 });

    when(mockedCharacterEntity.equip(weapon)).thenReturn(weapon2);

    service = TestBed.inject(EquipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when skill value is above 0', () => {
      it('return logs', () => {
        when(mockedCharacterEntity.equip(weapon)).thenReturn(null);

        when(mockedInventoryService.take('player', 'sword')).thenReturn(weapon);

        when(mockedItemStore.itemSkill(event.eventId)).thenReturn(
          'Artillery (War)'
        );

        const result = service.execute(instance(mockedCharacterEntity), event);

        expect(result).toEqual({
          logs: [log],
        });
      });
    });

    describe('when a previous weapon was equipped', () => {
      it('return logs', () => {
        when(mockedInventoryService.take('player', 'sword')).thenReturn(weapon);

        when(mockedItemStore.itemSkill(event.eventId)).thenReturn(
          'Artillery (War)'
        );

        const result = service.execute(instance(mockedCharacterEntity), event);

        expect(result).toEqual({
          logs: [log2, log],
        });
      });

      it('should store previous weapon', () => {
        let result = 0;

        when(mockedInventoryService.take('player', 'sword')).thenReturn(weapon);

        when(mockedInventoryService.store('player', weapon2)).thenCall(
          () => (result = 1)
        );

        when(mockedItemStore.itemSkill(event.eventId)).thenReturn(
          'Artillery (War)'
        );

        service.execute(instance(mockedCharacterEntity), event);

        expect(result).toEqual(1);
      });
    });

    describe('when skill value is 0', () => {
      it('return logs', () => {
        when(mockedItemStore.itemSkill(event.eventId)).thenReturn(
          'Artillery (Siege)'
        );

        when(mockedItemStore.itemLabel(event.eventId)).thenReturn('Sword');

        const result = service.execute(instance(mockedCharacterEntity), event);

        expect(result).toEqual({
          logs: [logError],
        });
      });
    });
  });
});

const event = new ActionableEvent(
  createActionableDefinition('EQUIP', 'equip', 'Equip'),
  'sword'
);

const mockedInventoryService = mock(InventoryService);

const mockedItemStore = mock(ItemStore);

const mockedCharacterEntity = mock(PlayerEntity);

const log = createEquippedLogMessage('player', 'Sword');

const log2 = createUnEquippedLogMessage('player', 'Sword 2');

const logError = createEquipErrorLogMessage(
  'player',
  'Artillery (Siege)',
  'Sword'
);

const weapon = new WeaponDefinition(
  'sword',
  'Sword',
  'some sword',
  'Artillery (War)',
  new DamageDefinition(createDice(), 2),
  true,
  'PERMANENT'
);

const weapon2 = new WeaponDefinition(
  'sword2',
  'Sword 2',
  'some sword 2',
  'Artillery (War)',
  new DamageDefinition(createDice(), 2),
  true,
  'PERMANENT'
);
