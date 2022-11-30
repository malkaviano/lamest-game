import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { ConsumableDefinition } from '../definitions/consumable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { CharacterEntity } from '../entities/character.entity';
import { ActionableEvent } from '../events/actionable.event';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { RandomIntService } from '../services/random-int.service';

import { ConsumeRule } from './consume.rule';

describe('ConsumeRule', () => {
  let service: ConsumeRule;

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
          provide: RandomIntService,
          useValue: instance(mockedRngService),
        },
      ],
    });

    when(mockedCharacterService.currentCharacter).thenReturn(
      instance(mockedCharacterEntity)
    );

    when(mockedCharacterEntity.skills).thenReturn({ 'First Aid': 45 });

    service = TestBed.inject(ConsumeRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item is not a consumable', () => {
      it('throw Wrong item was used', () => {
        when(mockedInventoryService.take('player', 'gun')).thenReturn(
          new WeaponDefinition(
            'gun',
            'Gun',
            '',
            'Firearm (Handgun)',
            new DamageDefinition(createDice(), 0),
            true
          )
        );

        expect(() =>
          service.execute(new ActionableEvent(action, 'gun'))
        ).toThrowError(errorMessages['WRONG-ITEM']);
      });
    });

    describe('when consumable has skill requirement', () => {
      describe('when skill check passes', () => {
        it('should heal player', () => {
          when(mockedInventoryService.take('player', 'firstAid')).thenReturn(
            consumable
          );

          when(mockedRngService.checkSkill(45)).thenReturn({
            result: 'SUCCESS',
            roll: 10,
          });

          when(mockedCharacterEntity.healed(5)).thenReturn(
            'healed 5 Hit Points and become full health'
          );

          const result = service.execute(event);

          expect(result).toEqual({
            logs: [
              'player: consumed First Aid Kit',
              'player: rolled 10 in First Aid and resulted in SUCCESS',
              'player: healed 5 Hit Points and become full health',
            ],
          });
        });
      });
    });

    describe('when consumable has no skill requirement', () => {
      it('should heal player', () => {
        when(mockedInventoryService.take('player', 'sandwich')).thenReturn(
          consumable2
        );

        when(mockedCharacterEntity.healed(2)).thenReturn(
          'healed 2 Hit Points and become full health'
        );

        const result = service.execute(event2);

        expect(result).toEqual({
          logs: [
            'player: consumed Cheeseburger',
            'player: healed 2 Hit Points and become full health',
          ],
        });
      });
    });
  });
});

const consumable = new ConsumableDefinition(
  'firstAid',
  'First Aid Kit',
  'Very simple First Aid',
  5,
  'First Aid'
);

const consumable2 = new ConsumableDefinition(
  'sandwich',
  'Cheeseburger',
  'Delicious',
  2
);

const action = createActionableDefinition('CONSUME', '', '');

const event = new ActionableEvent(action, 'firstAid');

const event2 = new ActionableEvent(action, 'sandwich');

const mockedCharacterService = mock(CharacterService);

const mockedInventoryService = mock(InventoryService);

const mockedRngService = mock(RandomIntService);

const mockedCharacterEntity = mock(CharacterEntity);
