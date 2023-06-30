import { anything, deepEqual, instance, verify, when } from 'ts-mockito';

import { AffectRule } from './affect.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { RollDefinition } from '../../core/definitions/roll.definition';
import { EffectEvent } from '../../core/events/effect.event';

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
  actionAttack,
  actorInfo,
  interactiveInfo,
  molotov,
  playerInfo,
  simpleSword,
  unDodgeableAxe,
} from '../../../tests/fakes';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

describe('AffectRule', () => {
  const rule = new AffectRule(
    instance(mockedRollHelper),
    instance(mockedCheckedService),
    instance(mockedActivationAxiom),
    instance(mockedDodgeAxiom),
    instance(mockedAffectedAxiom)
  );

  beforeEach(() => {
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
      mockedActivationAxiom.activation(
        actor,
        deepEqual({
          identity: molotov.identity,
          energyActivation: molotov.energyActivation,
        })
      )
    ).thenReturn(true);

    when(
      mockedRollHelper.actorSkillCheck(actor, 'Ranged Weapon (Throw)')
    ).thenReturn(new RollDefinition('SUCCESS', 5));

    when(
      mockedActivationAxiom.activation(
        actor,
        deepEqual({
          identity: simpleSword.identity,
          energyActivation: simpleSword.energyActivation,
        })
      )
    ).thenReturn(true);

    when(
      mockedRollHelper.actorSkillCheck(actor, 'Melee Weapon (Simple)')
    ).thenReturn(new RollDefinition('SUCCESS', 5));
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when throwing molotov', () => {
      describe('when target is actor', () => {
        describe('when check skill succeed', () => {
          it('should log used molotov and lost molotov', (done) => {
            when(
              mockedDodgeAxiom.dodge(
                target,
                deepEqual({
                  dodgeable: false,
                  dodgesPerformed: 0,
                })
              )
            ).thenReturn(false);

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
                actionAttack,
                'SUCCESS',
                deepEqual({
                  effect: new EffectEvent('FIRE', 2),
                })
              )
            ).once();

            verify(
              mockedDodgeAxiom.dodge(
                target,
                deepEqual({
                  dodgeable: false,
                  dodgesPerformed: 0,
                })
              )
            ).once();

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

              when(
                mockedDodgeAxiom.dodge(
                  target,
                  deepEqual({
                    dodgeable: true,
                    dodgesPerformed: 0,
                  })
                )
              ).thenReturn(true);

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

              verify(
                mockedDodgeAxiom.dodge(
                  target,
                  deepEqual({
                    dodgeable: true,
                    dodgesPerformed: 0,
                  })
                )
              ).once();

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
      it('return denied result', () => {
        when(mockedPlayerEntity.weaponEquipped).thenReturn(simpleSword);

        when(
          mockedDodgeAxiom.dodge(
            target,
            deepEqual({
              dodgeable: true,
              dodgesPerformed: 0,
            })
          )
        ).thenReturn(true);

        const result = rule.execute(actor, eventAttackInteractive, {
          target,
        });

        const expected: RuleResultInterface = {
          event: eventAttackInteractive,
          actor,
          result: 'DENIED',
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

        when(
          mockedDodgeAxiom.dodge(
            target,
            deepEqual({
              dodgeable: true,
              dodgesPerformed: 0,
            })
          )
        ).thenReturn(false);

        const result = rule.execute(actor, eventAttackInteractive, {
          target,
        });

        const expected: RuleResultInterface = {
          event: eventAttackInteractive,
          actor,
          result: 'AFFECTED',
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
  actionAttack,
  interactiveInfo.id
);