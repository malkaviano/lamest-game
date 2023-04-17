import { anything, deepEqual, instance, verify, when } from 'ts-mockito';

import { CombatRule } from './combat.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { RollDefinition } from '../../core/definitions/roll.definition';
import { EffectEvent } from '../../core/events/effect.event';

import { ruleScenario } from '../../../tests/scenarios';
import {
  mockedActivationAxiomService,
  mockedActorEntity,
  mockedAffectedAxiomService,
  mockedCheckedService,
  mockedDodgeAxiomService,
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

describe('CombatRule', () => {
  const rule = new CombatRule(
    instance(mockedRollHelper),
    instance(mockedCheckedService),
    instance(mockedActivationAxiomService),
    instance(mockedDodgeAxiomService),
    instance(mockedAffectedAxiomService)
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
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when throwing molotov', () => {
      describe('when target is actor', () => {
        describe('when check skill succeed', () => {
          it('should log used molotov and lost molotov', (done) => {
            when(mockedPlayerEntity.weaponEquipped).thenReturn(molotov);

            when(
              mockedActivationAxiomService.activation(
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
              mockedDodgeAxiomService.dodge(
                target,
                deepEqual({
                  dodgeable: false,
                  dodgesPerformed: 0,
                })
              )
            ).thenReturn(false);

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
              mockedAffectedAxiomService.affectWith(
                target,
                actionAttack,
                'SUCCESS',
                deepEqual({
                  effect: new EffectEvent('FIRE', 2),
                })
              )
            ).once();

            verify(
              mockedDodgeAxiomService.dodge(
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
                mockedActivationAxiomService.activation(
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

              when(
                mockedDodgeAxiomService.dodge(
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
                mockedAffectedAxiomService.affectWith(
                  anything(),
                  anything(),
                  anything(),
                  anything()
                )
              ).never();

              verify(
                mockedDodgeAxiomService.dodge(
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
