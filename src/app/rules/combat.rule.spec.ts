import { TestBed } from '@angular/core/testing';

import { anyString, deepEqual, instance, when } from 'ts-mockito';

import { CombatRule } from './combat.rule';
import { RollService } from '../services/roll.service';
import { unarmedWeapon } from '../definitions/weapon.definition';
import { EffectEvent } from '../events/effect.event';
import { ExtractorHelper } from '../helpers/extractor.helper';

import {
  mockedActorEntity,
  mockedExtractorHelper,
  mockedInteractiveEntity,
  mockedPlayerEntity,
  mockedRollService,
  mockedTargetPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionAttack,
  interactiveInfo,
  molotov,
  playerInfo,
  shadowDagger,
  shadowSword,
  simpleSword,
  unDodgeableAxe,
} from '../../../tests/fakes';
import { LogMessageDefinition } from '../definitions/log-message.definition';

describe('CombatRule', () => {
  let service: CombatRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RollService,
          useValue: instance(mockedRollService),
        },
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
      ],
    });

    setupMocks();

    when(mockedRollService.roll(simpleSword.damage.diceRoll)).thenReturn(0);

    when(mockedRollService.roll(unDodgeableAxe.damage.diceRoll)).thenReturn(0);

    when(mockedPlayerEntity.weaponEquipped).thenReturn(simpleSword);

    when(mockedActorEntity.weaponEquipped).thenReturn(simpleSword);

    when(mockedPlayerEntity.dodgesPerRound).thenReturn(2);

    when(mockedActorEntity.dodgesPerRound).thenReturn(2);

    when(mockedTargetPlayerEntity.dodgesPerRound).thenReturn(2);

    when(
      mockedActorEntity.reactTo(
        deepEqual(eventAttackInteractive.actionableDefinition),
        'SUCCESS',
        deepEqual({
          effect: new EffectEvent('KINETIC', 2),
        })
      )
    ).thenReturn(damageMessage2);

    when(
      mockedTargetPlayerEntity.reactTo(
        deepEqual(eventAttackInteractive.actionableDefinition),
        'SUCCESS',
        deepEqual({
          effect: new EffectEvent('KINETIC', 2),
        })
      )
    ).thenReturn(damageMessage2);

    when(
      mockedInteractiveEntity.reactTo(
        deepEqual(eventAttackInteractive.actionableDefinition),
        'SUCCESS',
        deepEqual({
          effect: new EffectEvent('FIRE', 2),
        })
      )
    ).thenReturn(damageMessage2);

    when(
      mockedInteractiveEntity.reactTo(
        deepEqual(eventAttackInteractive.actionableDefinition),
        'SUCCESS',
        deepEqual({
          effect: new EffectEvent('KINETIC', 2),
        })
      )
    ).thenReturn(damageMessage2);

    service = TestBed.inject(CombatRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

const damageMessage2 = `${simpleSword.damage.effectType}-2`;

const damageInteractiveLog = new LogMessageDefinition(
  'AFFECTED',
  'somebody',
  damageMessage2
);

const checkFailureLog = new LogMessageDefinition(
  'CHECK',
  'somebody',
  'Melee Weapon (Simple)-90-FAILURE'
);

const checkSuccessLog = new LogMessageDefinition(
  'CHECK',
  'somebody',
  'Melee Weapon (Simple)-10-SUCCESS'
);

const usedItemLog = new LogMessageDefinition(
  'USED',
  'somebody',
  'was attacked with force by some item'
);

const resultDamageLog = new LogMessageDefinition(
  'AFFECTED',
  'somebody',
  damageMessage2
);

const cannotDodgeLog = new LogMessageDefinition(
  'AFFECTED',
  'target',
  'Yo cannot dodge'
);

const outOfDodgesLog = new LogMessageDefinition(
  'AFFECTED',
  'somebody',
  'out of dodges'
);

const lostItemLog = new LogMessageDefinition(
  'AFFECTED',
  playerInfo.name,
  molotov.identity.label
);

const eventAttackInteractive = actionableEvent(
  actionAttack,
  interactiveInfo.id
);

const eventAttackPlayer = actionableEvent(actionAttack, playerInfo.id);
