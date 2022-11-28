import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { unarmed } from '../definitions/weapon.definition';
import { CharacterEntity } from '../entities/character.entity';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';
import { AttackRule } from './attack.rule';

describe('AttackRule', () => {
  let service: AttackRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NarrativeService,
          useValue: instance(mockedNarrativeService),
        },
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

    when(mockedCharacterEntity.skills).thenReturn({ Brawl: 45 });

    when(mockedInventoryService.equipped).thenReturn(null);

    when(mockedNarrativeService.interatives).thenReturn(interactives);

    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    service = TestBed.inject(AttackRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when attack misses', () => {
      it('return logs', () => {
        when(mockedRngService.checkSkill(45)).thenReturn({
          result: 'SUCCESS',
          roll: 10,
        });

        when(mockedRngService.roll(unarmed.damage.diceRoll)).thenReturn(
          1 + unarmed.damage.fixed
        );

        when(
          mockedInteractiveEntity.actionSelected(action, 'SUCCESS', 1)
        ).thenReturn('GG');

        const result = service.execute(event);

        expect(result).toEqual({
          logs: [
            'player: attacked test USING Bare hands',
            'player: used Brawl and rolled 10 -> SUCCESS',
            'player: did 1 damage with Bare hands',
            'test: GG',
          ],
        });
      });
    });
  });
});

const mockedCharacterService = mock(CharacterService);

const mockedInventoryService = mock(InventoryService);

const mockedRngService = mock(RandomIntService);

const mockedNarrativeService = mock(NarrativeService);

const mockedInteractiveEntity = mock(InteractiveEntity);

const action = createActionableDefinition('ATTACK', 'attack', 'Attack');

const event = new ActionableEvent(action, 'id1');

const mockedCharacterEntity = mock(CharacterEntity);

const interactives: KeyValueInterface<InteractiveEntity> = {
  id1: instance(mockedInteractiveEntity),
};
