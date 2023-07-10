import { anything, deepEqual, instance, verify, when } from 'ts-mockito';

import { AffectRule } from './affect.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { RollDefinition } from '@definitions/roll.definition';
import { EffectEvent } from '@events/effect.event';

import { ruleScenario } from '../../../tests/scenarios';
import {
  mockedActivationAxiom,
  mockedActorEntity,
  mockedAffectedAxiom,
  mockedCheckedService,
  mockedDodgeAxiom,
  mockedPlayerEntity,
  mockedRollHelper,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionAffect,
  actorInfo,
  interactiveInfo,
  molotov,
  playerInfo,
  simpleSword,
  unDodgeableAxe,
} from '../../../tests/fakes';
import { RuleResultInterface } from '@interfaces/rule-result.interface';

describe('AffectRule', () => {
  let rule: AffectRule;

  beforeEach(() => {
    rule = new AffectRule(
      instance(mockedRollHelper),
      instance(mockedCheckedService),
      instance(mockedActivationAxiom),
      instance(mockedDodgeAxiom),
      instance(mockedAffectedAxiom)
    );

    setupMocks();

    when(mockedRollHelper.roll(simpleSword.damage.diceRoll)).thenReturn(0);

    when(mockedRollHelper.roll(unDodgeableAxe.damage.diceRoll)).thenReturn(0);

    when(mockedPlayerEntity.dodgesPerRound).thenReturn(2);

    when(mockedActorEntity.dodgesPerRound).thenReturn(2);

    when(mockedActorEntity.wannaDodge('KINETIC')).thenReturn(true);

    when(mockedActorEntity.wannaDodge('FIRE')).thenReturn(true);

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
      mockedRollHelper.actorSkillCheck(actor, 'Ranged Weapon (Throw)')
    ).thenReturn(new RollDefinition('SUCCESS', 5));

    when(
      mockedRollHelper.actorSkillCheck(actor, 'Melee Weapon (Simple)')
    ).thenReturn(new RollDefinition('SUCCESS', 5));

    when(
      mockedActivationAxiom.activation(
        actor,
        molotov.energyActivation,
        molotov.identity.label
      )
    ).thenReturn(true);

    when(
      mockedActivationAxiom.activation(
        actor,
        simpleSword.energyActivation,
        simpleSword.identity.label
      )
    ).thenReturn(true);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when throwing molotov', () => {
      describe('when target is actor', () => {
        describe('when check skill succeed', () => {
          it('should log used molotov and lost molotov', (done) => {
            when(mockedDodgeAxiom.dodged(target, false, 0)).thenReturn(false);

            when(mockedPlayerEntity.weaponEquipped).thenReturn(molotov);

            ruleScenario(
              rule,
              actor,
              eventAttackInteractive,
              {
                target,
              },
              [usedMolotovLog, lostMolotovLog],
              done
            );

            verify(
              mockedAffectedAxiom.affectWith(
                target,
                actionAffect,
                'SUCCESS',
                deepEqual({
                  effect: new EffectEvent('FIRE', 2),
                })
              )
            ).once();

            verify(mockedDodgeAxiom.dodged(target, false, 0)).once();

            verify(
              mockedRollHelper.actorSkillCheck(actor, 'Ranged Weapon (Throw)')
            ).once();
          });
        });
      });
    });

    describe('when attacking with sword', () => {
      describe('when target is actor', () => {
        describe('when check skill succeed', () => {
          describe('when target dodges', () => {
            it('should log used sword', (done) => {
              when(mockedPlayerEntity.weaponEquipped).thenReturn(simpleSword);

              when(mockedDodgeAxiom.dodged(target, true, 0)).thenReturn(true);

              ruleScenario(
                rule,
                actor,
                eventAttackInteractive,
                {
                  target,
                },
                [usedSwordLog],
                done
              );

              verify(
                mockedAffectedAxiom.affectWith(
                  anything(),
                  anything(),
                  anything(),
                  anything()
                )
              ).never();

              verify(mockedDodgeAxiom.dodged(target, true, 0)).once();

              verify(
                mockedRollHelper.actorSkillCheck(actor, 'Melee Weapon (Simple)')
              ).once();
            });
          });
        });
      });
    });

    describe('when no energy to activate', () => {
      it('return denied result', () => {
        when(mockedPlayerEntity.weaponEquipped).thenReturn(unDodgeableAxe);

        const result = rule.execute(actor, eventAttackInteractive, {
          target,
        });

        const expected: RuleResultInterface = {
          name: 'AFFECT',
          event: eventAttackInteractive,
          actor,
          result: 'DENIED',
          target,
          affected: unDodgeableAxe,
          skill: { name: 'Melee Weapon (Simple)' },
        };

        expect(result).toEqual(expected);
      });
    });

    describe('when target dodged', () => {
      it('return avoided result', () => {
        when(mockedPlayerEntity.weaponEquipped).thenReturn(simpleSword);

        when(mockedDodgeAxiom.dodged(target, true, 0)).thenReturn(true);

        const result = rule.execute(actor, eventAttackInteractive, {
          target,
        });

        const expected: RuleResultInterface = {
          name: 'AFFECT',
          event: eventAttackInteractive,
          actor,
          result: 'AVOIDED',
          target,
          affected: simpleSword,
          skill: { name: 'Melee Weapon (Simple)', roll: 5 },
          dodged: true,
        };

        expect(result).toEqual(expected);
      });
    });

    describe('when target is affected', () => {
      it('return affect result', () => {
        when(mockedPlayerEntity.weaponEquipped).thenReturn(simpleSword);

        when(mockedDodgeAxiom.dodged(target, true, 0)).thenReturn(false);

        const result = rule.execute(actor, eventAttackInteractive, {
          target,
        });

        const expected: RuleResultInterface = {
          name: 'AFFECT',
          event: eventAttackInteractive,
          actor,
          result: 'EXECUTED',
          target,
          affected: simpleSword,
          skill: { name: 'Melee Weapon (Simple)', roll: 5 },
          dodged: false,
          effect: { type: 'KINETIC', amount: 2 },
        };

        expect(result).toEqual(expected);
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const target = instance(mockedActorEntity);

const damageMessage2 = `${simpleSword.damage.effectType}-2`;

const usedMolotovLog = GameStringsStore.createUsedItemLogMessage(
  playerInfo.name,
  actorInfo.name,
  molotov.identity.label
);

const lostMolotovLog = GameStringsStore.createLostItemLogMessage(
  playerInfo.name,
  molotov.identity.label
);

const usedSwordLog = GameStringsStore.createUsedItemLogMessage(
  playerInfo.name,
  actorInfo.name,
  simpleSword.identity.label
);

const eventAttackInteractive = actionableEvent(
  actionAffect,
  interactiveInfo.id
);
