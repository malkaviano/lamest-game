import { deepEqual, instance, verify, when } from 'ts-mockito';

import { AffectRule } from '@rules/affect.rule';
import { GameStringsStore } from '@stores/game-strings.store';
import { RollDefinition } from '@definitions/roll.definition';
import { EffectEvent } from '@events/effect.event';
import { RuleResult } from '@results/rule.result';
import { affectActionable } from '@definitions/actionable.definition';

import { ruleScenario } from '../../../tests/scenarios';
import {
  mockedActorEntity,
  mockedCheckedService,
  mockedDodgeAxiom,
  mockedGamePredicate,
  mockedInteractiveEntity,
  mockedPlayerEntity,
  mockedRollService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actorInfo,
  glock,
  interactiveInfo,
  molotov,
  playerInfo,
  simpleSword,
  unDodgeableAxe,
} from '../../../tests/fakes';

describe('AffectRule', () => {
  let rule: AffectRule;

  beforeEach(() => {
    rule = new AffectRule(
      instance(mockedRollService),
      instance(mockedCheckedService),
      instance(mockedDodgeAxiom),
      instance(mockedGamePredicate)
    );

    setupMocks();

    when(mockedRollService.roll(simpleSword.damage.diceRoll)).thenReturn(0);

    when(mockedRollService.roll(unDodgeableAxe.damage.diceRoll)).thenReturn(0);

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
      mockedInteractiveEntity.reactTo(
        deepEqual(eventAttackInteractive.actionableDefinition),
        'SUCCESS',
        deepEqual({
          effect: new EffectEvent('KINETIC', 2),
        })
      )
    ).thenReturn(damageMessage2);

    when(
      mockedRollService.actorSkillCheck(actor, 'Ranged Weapon (Throw)')
    ).thenReturn(new RollDefinition('SUCCESS', 5));

    when(
      mockedRollService.actorSkillCheck(actor, 'Melee Weapon (Simple)')
    ).thenReturn(new RollDefinition('SUCCESS', 5));

    when(
      mockedRollService.actorSkillCheck(actor, 'Firearm (Handgun)')
    ).thenReturn(new RollDefinition('FAILURE', 85));

    when(
      mockedGamePredicate.canActivate(
        actor,
        molotov.energyActivation,
        molotov.identity.label
      )
    ).thenReturn(true);

    when(
      mockedGamePredicate.canActivate(
        actor,
        simpleSword.energyActivation,
        simpleSword.identity.label
      )
    ).thenReturn(true);

    when(
      mockedGamePredicate.canActivate(
        actor,
        unDodgeableAxe.energyActivation,
        unDodgeableAxe.identity.label
      )
    ).thenReturn(false);

    when(
      mockedGamePredicate.canActivate(
        actor,
        glock.energyActivation,
        glock.identity.label
      )
    ).thenReturn(true);

    when(
      mockedGamePredicate.canUseSkill(actor, 'Melee Weapon (Simple)')
    ).thenReturn(true);

    when(
      mockedGamePredicate.canUseSkill(actor, 'Firearm (Handgun)')
    ).thenReturn(true);

    when(
      mockedGamePredicate.canUseSkill(actor, 'Ranged Weapon (Throw)')
    ).thenReturn(true);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when throwing molotov', () => {
      describe('when target is interactive', () => {
        describe('when check skill succeed', () => {
          it('should log used molotov', (done) => {
            when(mockedPlayerEntity.weaponEquipped).thenReturn(molotov);

            ruleScenario(
              rule,
              actor,
              eventAttackInteractive,
              {
                target: target2,
              },
              [usedMolotovLog],
              done
            );
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

              when(mockedDodgeAxiom.dodged(target, true)).thenReturn(true);

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

              verify(mockedDodgeAxiom.dodged(target, true)).once();

              verify(
                mockedRollService.actorSkillCheck(
                  actor,
                  'Melee Weapon (Simple)'
                )
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

        const expected: RuleResult = {
          name: 'AFFECT',
          event: eventAttackInteractive,
          actor,
          result: 'DENIED',
          target,
          affected: unDodgeableAxe,
          skillName: 'Melee Weapon (Simple)',
        };

        expect(result).toEqual(expected);
      });
    });

    describe('when target dodged', () => {
      it('return avoided result', () => {
        when(mockedPlayerEntity.weaponEquipped).thenReturn(simpleSword);

        when(mockedDodgeAxiom.dodged(target, true)).thenReturn(true);

        const result = rule.execute(actor, eventAttackInteractive, {
          target,
        });

        const expected: RuleResult = {
          name: 'AFFECT',
          event: eventAttackInteractive,
          actor,
          result: 'AVOIDED',
          target,
          affected: simpleSword,
          skillName: 'Melee Weapon (Simple)',
          roll: { checkRoll: 5, result: 'SUCCESS' },
          dodged: true,
        };

        expect(result).toEqual(expected);
      });
    });

    describe('when affecting target', () => {
      describe('when roll succeeds', () => {
        it('return success result', () => {
          when(mockedPlayerEntity.weaponEquipped).thenReturn(simpleSword);

          when(mockedDodgeAxiom.dodged(target, true)).thenReturn(false);

          const result = rule.execute(actor, eventAttackInteractive, {
            target,
          });

          const expected: RuleResult = {
            name: 'AFFECT',
            event: eventAttackInteractive,
            actor,
            result: 'EXECUTED',
            target,
            affected: simpleSword,
            skillName: 'Melee Weapon (Simple)',
            roll: { checkRoll: 5, result: 'SUCCESS' },
            dodged: false,
            effect: { type: 'KINETIC', amount: 2 },
          };

          expect(result).toEqual(expected);
        });
      });

      describe('when roll fails', () => {
        it('return avoided result', () => {
          when(mockedPlayerEntity.weaponEquipped).thenReturn(glock);

          when(mockedDodgeAxiom.dodged(target, false)).thenReturn(false);

          const result = rule.execute(actor, eventAttackInteractive, {
            target,
          });

          const expected: RuleResult = {
            name: 'AFFECT',
            event: eventAttackInteractive,
            actor,
            result: 'AVOIDED',
            target,
            affected: glock,
            skillName: 'Firearm (Handgun)',
            roll: { checkRoll: 85, result: 'FAILURE' },
          };

          expect(result).toEqual(expected);
        });
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const target = instance(mockedActorEntity);

const target2 = instance(mockedInteractiveEntity);

const damageMessage2 = `${simpleSword.damage.effectType}-2`;

const usedMolotovLog = GameStringsStore.createUsedItemLogMessage(
  playerInfo.name,
  interactiveInfo.name,
  molotov.identity.label
);

const usedSwordLog = GameStringsStore.createUsedItemLogMessage(
  playerInfo.name,
  actorInfo.name,
  simpleSword.identity.label
);

const eventAttackInteractive = actionableEvent(
  affectActionable,
  interactiveInfo.id
);
