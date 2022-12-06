import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createDamagedMessage,
  createFreeLogMessage,
  createLostLogMessage,
} from '../definitions/log-message.definition';
import { RollDefinition } from '../definitions/roll.definition';
import { unarmed, WeaponDefinition } from '../definitions/weapon.definition';
import { CharacterEntity } from '../entities/character.entity';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { CharacterService } from '../services/character.service';
import { InventoryService } from '../services/inventory.service';
import { NarrativeService } from '../services/narrative.service';
import { AttackRule } from './attack.rule';
import { RollService } from '../services/roll.service';

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
          provide: RollService,
          useValue: instance(mockedRollRule),
        },
        {
          provide: CharacterService,
          useValue: instance(mockedCharacterService),
        },
      ],
    });

    when(mockedCharacterService.currentCharacter).thenReturn(
      instance(mockedCharacterEntity)
    );

    when(
      mockedRollRule.actorSkillCheck(instance(mockedCharacterEntity), 'Brawl')
    ).thenReturn(new RollDefinition('SUCCESS', 10));

    when(
      mockedRollRule.actorSkillCheck(
        instance(mockedCharacterEntity),
        'Ranged Weapon (Throw)'
      )
    ).thenReturn(new RollDefinition('SUCCESS', 15));

    when(
      mockedRollRule.actorSkillCheck(
        instance(mockedCharacterEntity),
        'Artillery (War)'
      )
    ).thenReturn(new RollDefinition('IMPOSSIBLE', 0));

    when(mockedNarrativeService.interatives).thenReturn(interactives);

    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    service = TestBed.inject(AttackRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      when(mockedRollRule.roll(unarmed.damage.diceRoll)).thenReturn(
        1 + unarmed.damage.fixed
      );

      when(
        mockedInteractiveEntity.actionSelected(action, 'SUCCESS', 1)
      ).thenReturn('received 1 damage');

      when(mockedInventoryService.equipped).thenReturn(null);

      const result = service.execute(event);

      expect(result).toEqual({
        logs: [log1, log2],
      });
    });

    describe('when weapon is DISPOSABLE', () => {
      it('return logs with disposed weapon', () => {
        const result = disposableScenario(service);

        expect(result).toEqual({
          logs: [log3, logDiscarded, log4],
        });
      });

      it('should dispose weapon', () => {
        let disposed = false;

        when(mockedInventoryService.dispose()).thenCall(
          () => (disposed = true)
        );

        disposableScenario(service);

        expect(disposed).toEqual(true);
      });
    });

    describe('when skill value is zero', () => {
      it('should log cannot skill check', () => {
        when(mockedInventoryService.equipped).thenReturn(impossibleWeapon);

        const result = service.execute(event);

        expect(result).toEqual({
          logs: [impossibleLog],
        });
      });
    });
  });
});

const mockedRollRule = mock(RollService);

const mockedInventoryService = mock(InventoryService);

const mockedNarrativeService = mock(NarrativeService);

const mockedInteractiveEntity = mock(InteractiveEntity);

const action = createActionableDefinition('ATTACK', 'attack', 'Attack');

const event = new ActionableEvent(action, 'id1');

const interactives: KeyValueInterface<InteractiveEntity> = {
  id1: instance(mockedInteractiveEntity),
};

const log1 = createCheckLogMessage('player', 'Brawl', 10, 'SUCCESS');

const log2 = createFreeLogMessage('test', createDamagedMessage(1));

const log3 = createCheckLogMessage(
  'player',
  'Ranged Weapon (Throw)',
  15,
  'SUCCESS'
);

const log4 = createFreeLogMessage('test', createDamagedMessage(5));

const disposableWeapon = new WeaponDefinition(
  'molotov',
  'Molotov',
  'Home made bomb',
  'Ranged Weapon (Throw)',
  new DamageDefinition(createDice({ D6: 1 }), 3),
  false,
  'DISPOSABLE'
);

const logDiscarded = createLostLogMessage('player', disposableWeapon.label);

const disposableScenario = (service: AttackRule): RuleResultInterface => {
  when(mockedRollRule.roll(disposableWeapon.damage.diceRoll)).thenReturn(2);

  when(mockedInteractiveEntity.actionSelected(action, 'SUCCESS', 5)).thenReturn(
    'received 5 damage'
  );

  when(mockedInventoryService.equipped).thenReturn(disposableWeapon);

  return service.execute(event);
};

const impossibleWeapon = new WeaponDefinition(
  'caliber50',
  '.50',
  'Anti tank weapon',
  'Artillery (War)',
  new DamageDefinition(createDice({ D6: 1 }), 3),
  false,
  'PERMANENT'
);

const impossibleLog = createCannotCheckLogMessage(
  'player',
  impossibleWeapon.skillName
);

const mockedCharacterService = mock(CharacterService);

const mockedCharacterEntity = mock(CharacterEntity);
