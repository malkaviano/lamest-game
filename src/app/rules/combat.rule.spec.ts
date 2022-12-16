import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import {
  createAttackedLogMessage,
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createDamagedMessage,
  createFreeLogMessage,
  createLostLogMessage,
  createOutOfDodgesLogMessage,
  createUnDodgeableAttackLogMessage,
} from '../definitions/log-message.definition';
import { CombatRule } from './combat.rule';
import { RollService } from '../services/roll.service';
import { unarmedWeapon } from '../definitions/weapon.definition';
import { EffectReceivedDefinition } from '../definitions/effect-received.definition';

import {
  mockedActorEntity,
  mockedInteractiveEntity,
  mockedPlayerEntity,
  mockedRollService,
  mockedTargetPlayerEntity,
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
  let service: CombatRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RollService,
          useValue: instance(mockedRollService),
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
          effect: new EffectReceivedDefinition('KINETIC', 2),
        })
      )
    ).thenReturn(damageMessage2);

    when(
      mockedTargetPlayerEntity.reactTo(
        deepEqual(eventAttackInteractive.actionableDefinition),
        'SUCCESS',
        deepEqual({
          effect: new EffectReceivedDefinition('KINETIC', 2),
        })
      )
    ).thenReturn(damageMessage2);

    when(
      mockedInteractiveEntity.reactTo(
        deepEqual(eventAttackInteractive.actionableDefinition),
        'SUCCESS',
        deepEqual({
          effect: new EffectReceivedDefinition('FIRE', 2),
        })
      )
    ).thenReturn(damageMessage2);

    when(
      mockedInteractiveEntity.reactTo(
        deepEqual(eventAttackInteractive.actionableDefinition),
        'SUCCESS',
        deepEqual({
          effect: new EffectReceivedDefinition('KINETIC', 2),
        })
      )
    ).thenReturn(damageMessage2);

    service = TestBed.inject(CombatRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when target was INTERACTIVE', () => {
      it('should automatic hit', () => {
        const result = service.execute(
          instance(mockedPlayerEntity),
          eventAttackInteractive,
          { target: instance(mockedInteractiveEntity) }
        );

        expect(result).toEqual({ logs: [damageInteractiveLog] });
      });
    });

    [
      {
        target: mockedActorEntity,
        name: actorInfo.name,
      },
      {
        target: mockedTargetPlayerEntity,
        name: 'targetPlayer',
      },
    ].forEach(({ target, name }) => {
      describe(`when target was ACTOR`, () => {
        describe('when attack fails', () => {
          it('return logs', () => {
            const actor = instance(mockedPlayerEntity);

            when(
              mockedRollService.actorSkillCheck(actor, 'Melee Weapon (Simple)')
            ).thenReturn({ result: 'FAILURE', roll: 90 });

            const result = service.execute(actor, eventAttackInteractive, {
              target: instance(target),
            });

            expect(result).toEqual({
              logs: [
                createAttackedLogMessage(
                  playerInfo.name,
                  name,
                  simpleSword.identity.label
                ),
                checkFailureLog,
              ],
            });
          });
        });

        describe('when attack succeed', () => {
          describe('when target cannot dodge', () => {
            it('return logs', () => {
              when(
                mockedRollService.actorSkillCheck(
                  instance(mockedPlayerEntity),
                  'Melee Weapon (Simple)'
                )
              ).thenReturn({ result: 'SUCCESS', roll: 10 });

              when(
                mockedRollService.actorSkillCheck(instance(target), 'Dodge')
              ).thenReturn({ result: 'IMPOSSIBLE', roll: 0 });

              const result = service.execute(
                instance(mockedPlayerEntity),
                eventAttackInteractive,
                { target: instance(target) }
              );

              expect(result).toEqual({
                logs: [
                  createAttackedLogMessage(
                    playerInfo.name,
                    name,
                    simpleSword.identity.label
                  ),
                  checkSuccessLog,
                  createCannotCheckLogMessage(name, 'Dodge'),
                  createFreeLogMessage(name, damageMessage2),
                ],
              });
            });
          });

          describe('when attack is undodgeable', () => {
            it('return logs', () => {
              when(mockedPlayerEntity.weaponEquipped).thenReturn(
                unDodgeableAxe
              );

              when(
                mockedRollService.actorSkillCheck(
                  instance(mockedPlayerEntity),
                  'Melee Weapon (Simple)'
                )
              ).thenReturn({ result: 'SUCCESS', roll: 10 });

              const result = service.execute(
                instance(mockedPlayerEntity),
                eventAttackInteractive,
                { target: instance(target) }
              );

              expect(result).toEqual({
                logs: [
                  createAttackedLogMessage(
                    playerInfo.name,
                    name,
                    unDodgeableAxe.identity.label
                  ),
                  checkSuccessLog,
                  createUnDodgeableAttackLogMessage(name),
                  createFreeLogMessage(name, damageMessage2),
                ],
              });
            });
          });

          describe('when attack is dodgeable', () => {
            describe('when target dodges', () => {
              it('return logs', () => {
                const actor = instance(mockedPlayerEntity);

                when(
                  mockedRollService.actorSkillCheck(
                    actor,
                    'Melee Weapon (Simple)'
                  )
                ).thenReturn({ result: 'SUCCESS', roll: 10 });

                when(
                  mockedRollService.actorSkillCheck(instance(target), 'Dodge')
                ).thenReturn({ result: 'SUCCESS', roll: 15 });

                const result = service.execute(actor, eventAttackInteractive, {
                  target: instance(target),
                });

                expect(result).toEqual({
                  logs: [
                    createAttackedLogMessage(
                      playerInfo.name,
                      name,
                      simpleSword.identity.label
                    ),
                    checkSuccessLog,
                    createCheckLogMessage(name, 'Dodge', 15, 'SUCCESS'),
                  ],
                });
              });
            });

            describe('when target fails dodge', () => {
              it('return logs', () => {
                when(
                  mockedRollService.actorSkillCheck(
                    instance(mockedPlayerEntity),
                    'Melee Weapon (Simple)'
                  )
                ).thenReturn({ result: 'SUCCESS', roll: 10 });

                when(
                  mockedRollService.actorSkillCheck(instance(target), 'Dodge')
                ).thenReturn({ result: 'FAILURE', roll: 75 });

                const result = service.execute(
                  instance(mockedPlayerEntity),
                  eventAttackInteractive,
                  { target: instance(target) }
                );

                expect(result).toEqual({
                  logs: [
                    createAttackedLogMessage(
                      playerInfo.name,
                      name,
                      simpleSword.identity.label
                    ),
                    checkSuccessLog,
                    createCheckLogMessage(name, 'Dodge', 75, 'FAILURE'),
                    createFreeLogMessage(name, damageMessage2),
                  ],
                });
              });
            });
          });
        });
      });
    });

    describe('disposable weapons', () => {
      it('should dispose weapon', () => {
        when(mockedPlayerEntity.weaponEquipped).thenReturn(molotov);

        when(mockedPlayerEntity.unEquip()).thenCall(() => {
          when(mockedPlayerEntity.weaponEquipped).thenReturn(unarmedWeapon);
        });

        service.execute(instance(mockedPlayerEntity), eventAttackInteractive, {
          target: instance(mockedInteractiveEntity),
        });

        expect(instance(mockedPlayerEntity).weaponEquipped).toEqual(
          unarmedWeapon
        );
      });

      it('return logs', () => {
        when(mockedPlayerEntity.weaponEquipped).thenReturn(molotov);

        when(mockedPlayerEntity.unEquip()).thenCall(() => {
          when(mockedPlayerEntity.weaponEquipped).thenReturn(unarmedWeapon);
        });

        const result = service.execute(
          instance(mockedPlayerEntity),
          eventAttackInteractive,
          { target: instance(mockedInteractiveEntity) }
        );

        expect(result).toEqual({
          logs: [
            createLostLogMessage(playerInfo.name, molotov.identity.label),
            damageInteractiveLog,
          ],
        });
      });
    });

    describe('actor out of dodges', () => {
      it('return actor is out of dodges', () => {
        const actor = instance(mockedActorEntity);

        const target = instance(mockedPlayerEntity);

        when(
          mockedRollService.actorSkillCheck(
            instance(mockedActorEntity),
            'Melee Weapon (Simple)'
          )
        ).thenReturn({ result: 'SUCCESS', roll: 10 });

        when(mockedRollService.actorSkillCheck(target, 'Dodge')).thenReturn({
          result: 'SUCCESS',
          roll: 15,
        });

        when(
          mockedPlayerEntity.reactTo(
            deepEqual(eventAttackPlayer.actionableDefinition),
            'SUCCESS',
            deepEqual({
              effect: new EffectReceivedDefinition('KINETIC', 2),
            })
          )
        ).thenReturn(damageMessage2);

        const result = service.execute(actor, eventAttackInteractive, {
          target: instance(mockedPlayerEntity),
          targetDodgesPerformed: 2,
        });

        expect(result).toEqual({
          logs: [
            createAttackedLogMessage(
              actor.name,
              target.name,
              simpleSword.identity.label
            ),
            createCheckLogMessage(
              actor.name,
              'Melee Weapon (Simple)',
              10,
              'SUCCESS'
            ),
            createOutOfDodgesLogMessage(target.name),
            createFreeLogMessage(target.name, damageMessage2),
          ],
        });
      });
    });
  });
});

const damageMessage2 = createDamagedMessage(2, simpleSword.damage.effectType);

const damageInteractiveLog = createFreeLogMessage(
  interactiveInfo.name,
  damageMessage2
);

const checkFailureLog = createCheckLogMessage(
  playerInfo.name,
  'Melee Weapon (Simple)',
  90,
  'FAILURE'
);

const checkSuccessLog = createCheckLogMessage(
  playerInfo.name,
  'Melee Weapon (Simple)',
  10,
  'SUCCESS'
);

const eventAttackInteractive = actionableEvent(
  actionAttack,
  interactiveInfo.id
);

const eventAttackPlayer = actionableEvent(actionAttack, playerInfo.id);
