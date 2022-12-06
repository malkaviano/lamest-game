import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { createUnEquippedLogMessage } from '../definitions/log-message.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { CharacterEntity } from '../entities/character.entity';
import { ActionableEvent } from '../events/actionable.event';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { UnEquipRule } from './unequip.rule';

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
          provide: CharacterService,
          useValue: instance(mockedCharacterService),
        },
      ],
    });

    service = TestBed.inject(UnEquipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      when(mockedInventoryService.store('player', weapon)).thenReturn(1);

      when(mockedCharacterService.currentCharacter).thenReturn(
        instance(mockedCharacter)
      );

      when(mockedCharacter.unEquip()).thenReturn(weapon);

      const logs = service.execute(
        new ActionableEvent(
          createActionableDefinition('UNEQUIP', 'unequip', 'Sword'),
          'someId'
        )
      );

      expect(logs).toEqual({
        logs: [log],
      });
    });
  });
});

const mockedInventoryService = mock(InventoryService);

const mockedCharacterService = mock(CharacterService);

const mockedCharacter = mock(CharacterEntity);

const log = createUnEquippedLogMessage('player', 'Sword');

const weapon = new WeaponDefinition(
  'sword',
  'Sword',
  'some sword',
  'Artillery (War)',
  new DamageDefinition(createDice(), 2),
  true,
  'PERMANENT'
);
