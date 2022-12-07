import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import {
  createAttackedLogMessage,
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createDamagedMessage,
  createFreeLogMessage,
  createLostLogMessage,
  createUnDodgeableAttackLogMessage,
} from '../definitions/log-message.definition';
import { CombatRule } from './combat.rule';
import { RollService } from '../services/roll.service';

import {
  mockedActorEntity,
  mockedInteractiveEntity,
  mockedPlayerEntity,
  mockedRollService,
  mockedTargetPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  attackEvent,
  molotov,
  simpleSword,
  unDodgeableAxe,
} from '../../../tests/fakes';
import { unarmedWeapon } from '../definitions/weapon.definition';

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

    when(
      mockedActorEntity.reactTo(
        deepEqual(attackEvent.actionableDefinition),
        'SUCCESS',
        2
      )
    ).thenReturn(damageMessage2);

    when(
      mockedTargetPlayerEntity.reactTo(
        deepEqual(attackEvent.actionableDefinition),
        'SUCCESS',
        2
      )
    ).thenReturn(damageMessage2);

    when(
      mockedInteractiveEntity.reactTo(
        deepEqual(attackEvent.actionableDefinition),
        'SUCCESS',
        2
      )
    ).thenReturn(damageMessage2);

    service = TestBed.inject(CombatRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when target classification is INTERACTIVE', () => {
      it('should automatic hit', () => {
        const result = service.execute(
          instance(mockedPlayerEntity),
          attackEvent,
          instance(mockedInteractiveEntity)
        );

        expect(result).toEqual({ logs: [damageInteractiveLog] });
      });
    });

    [
      {
        target: mockedActorEntity,
        classification: 'ACTOR',
        name: 'actor',
      },
      {
        target: mockedTargetPlayerEntity,
        classification: 'PLAYER',
        name: 'targetPlayer',
      },
    ].forEach(({ target, classification, name }) => {
      describe(`when target classification is ${classification}`, () => {
        describe('when attack fails', () => {
          it('return logs', () => {
            when(
              mockedRollService.actorSkillCheck(
                instance(mockedPlayerEntity),
                'Melee Weapon (Simple)'
              )
            ).thenReturn({ result: 'FAILURE', roll: 90 });

            const result = service.execute(
              instance(mockedPlayerEntity),
              attackEvent,
              instance(target)
            );

            expect(result).toEqual({
              logs: [
                createAttackedLogMessage('player', name, simpleSword.label),
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
                attackEvent,
                instance(target)
              );

              expect(result).toEqual({
                logs: [
                  createAttackedLogMessage('player', name, simpleSword.label),
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
                attackEvent,
                instance(target)
              );

              expect(result).toEqual({
                logs: [
                  createAttackedLogMessage(
                    'player',
                    name,
                    unDodgeableAxe.label
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
                when(
                  mockedRollService.actorSkillCheck(
                    instance(mockedPlayerEntity),
                    'Melee Weapon (Simple)'
                  )
                ).thenReturn({ result: 'SUCCESS', roll: 10 });

                when(
                  mockedRollService.actorSkillCheck(instance(target), 'Dodge')
                ).thenReturn({ result: 'SUCCESS', roll: 15 });

                const result = service.execute(
                  instance(mockedPlayerEntity),
                  attackEvent,
                  instance(target)
                );

                expect(result).toEqual({
                  logs: [
                    createAttackedLogMessage('player', name, simpleSword.label),
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
                  attackEvent,
                  instance(target)
                );

                expect(result).toEqual({
                  logs: [
                    createAttackedLogMessage('player', name, simpleSword.label),
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

        service.execute(
          instance(mockedPlayerEntity),
          attackEvent,
          instance(mockedInteractiveEntity)
        );

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
          attackEvent,
          instance(mockedInteractiveEntity)
        );

        expect(result).toEqual({
          logs: [
            createLostLogMessage('player', molotov.label),
            damageInteractiveLog,
          ],
        });
      });
    });
  });
});

const damageMessage2 = createDamagedMessage(2);

const damageInteractiveLog = createFreeLogMessage('test', damageMessage2);

const checkFailureLog = createCheckLogMessage(
  'player',
  'Melee Weapon (Simple)',
  90,
  'FAILURE'
);

const checkSuccessLog = createCheckLogMessage(
  'player',
  'Melee Weapon (Simple)',
  10,
  'SUCCESS'
);
