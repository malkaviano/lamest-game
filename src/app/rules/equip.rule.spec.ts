import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';
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
          provide: LoggingService,
          useValue: instance(mockedLoggingService),
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
      it('should call inventory equip', () => {
        let result: string[] = [];

        when(mockedInventoryService.equip('sword')).thenCall(() =>
          result.push('ok')
        );

        when(mockedLoggingService.log('equipped: Sword')).thenCall(() =>
          result.push('ok')
        );

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

        service.execute(event);

        expect(result).toEqual(['ok', 'ok']);
      });
    });

    describe('when skill value is 0', () => {
      it('should log unable to equip', () => {
        let result: string[] = [];

        when(
          mockedLoggingService.log(
            'error: Artillery (Siege) is required to equip Sword'
          )
        ).thenCall(() => result.push('ok'));

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

        service.execute(event);

        expect(result).toEqual(['ok']);
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

const mockedLoggingService = mock(LoggingService);

const mockedCharacterEntity = mock(CharacterEntity);
