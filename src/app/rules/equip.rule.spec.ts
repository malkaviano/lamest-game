import { TestBed } from '@angular/core/testing';

import { instance, mock, verify, when } from 'ts-mockito';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { CharacterEntity } from '../entities/character.entity';
import { ActionableEvent } from '../events/actionable.event';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { LoggingService } from '../services/logging.service';
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
          provide: CharacterService,
          useValue: instance(mockedCharacterService),
        },
        {
          provide: ItemStore,
          useValue: instance(mockedItemStore),
        },
      ],
    });

    when(mockedCharacterService.currentCharacter).thenReturn(
      instance(mockedCharacterEntity)
    );

    when(mockedCharacterEntity.skills).thenReturn({ 'Artillery (War)': 45 });

    service = TestBed.inject(EquipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when skill value is above 0', () => {
      it('return logs', () => {
        when(mockedInventoryService.equipped).thenReturn(
          new WeaponDefinition(
            'sword',
            'Sword',
            'some sword',
            'Artillery (War)',
            new DamageDefinition(createDice(), 2)
          )
        );

        when(mockedItemStore.itemSkill(event.eventId)).thenReturn(
          'Artillery (War)'
        );

        const result = service.execute(event);

        verify(mockedInventoryService.equip('sword')).once();

        expect(result).toEqual({
          logs: ['equipped: Sword'],
        });
      });
    });

    describe('when skill value is 0', () => {
      it('return logs', () => {
        when(mockedInventoryService.equipped).thenReturn(
          new WeaponDefinition(
            'sword',
            'Sword',
            'some sword',
            'Artillery (Siege)',
            new DamageDefinition(createDice(), 2)
          )
        );

        when(mockedItemStore.itemSkill(event.eventId)).thenReturn(
          'Artillery (Siege)'
        );

        when(mockedItemStore.itemLabel(event.eventId)).thenReturn('Sword');

        const result = service.execute(event);

        expect(result).toEqual({
          logs: ['error: Artillery (Siege) is required to equip Sword'],
        });
      });
    });
  });
});

const event = new ActionableEvent(
  createActionableDefinition('EQUIP', 'equip', 'Equip'),
  'sword'
);

const mockedCharacterService = mock(CharacterService);

const mockedInventoryService = mock(InventoryService);

const mockedItemStore = mock(ItemStore);

const mockedCharacterEntity = mock(CharacterEntity);
