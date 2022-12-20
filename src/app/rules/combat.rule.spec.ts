import { TestBed } from '@angular/core/testing';

import { anyString, deepEqual, instance, when } from 'ts-mockito';

import { CombatRule } from './combat.rule';
import { RollService } from '../services/roll.service';
import { unarmedWeapon } from '../definitions/weapon.definition';
import { EffectEvent } from '../events/effect.event';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';

import {
  mockedActorEntity,
  mockedExtractorHelper,
  mockedInteractiveEntity,
  mockedPlayerEntity,
  mockedRollService,
  mockedStringMessagesStoreService,
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
        {
          provide: StringMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(
      mockedStringMessagesStoreService.createSkillCheckLogMessage(
        anyString(),
        'Melee Weapon (Simple)',
        '10',
        'SUCCESS'
      )
    ).thenReturn(checkSuccessLog);

    when(
      mockedStringMessagesStoreService.createSkillCheckLogMessage(
        anyString(),
        'Melee Weapon (Simple)',
        '90',
        'FAILURE'
      )
    ).thenReturn(checkFailureLog);

    when(
      mockedStringMessagesStoreService.createFreeLogMessage(
        'ATTACKED',
        interactiveInfo.name,
        damageMessage2
      )
    ).thenReturn(damageInteractiveLog);

    when(
      mockedStringMessagesStoreService.createEffectDamagedMessage(
        simpleSword.damage.effectType,
        '2'
      )
    ).thenReturn(damageMessage2);

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

    when(
      mockedStringMessagesStoreService.createUsedItemLogMessage(
        anyString(),
        anyString(),
        anyString()
      )
    ).thenReturn(usedItemLog);

    when(
      mockedStringMessagesStoreService.createFreeLogMessage(
        'ATTACKED',
        anyString(),
        damageMessage2
      )
    ).thenReturn(resultDamageLog);

    when(
      mockedStringMessagesStoreService.createCannotCheckSkillLogMessage(
        anyString(),
        'Dodge'
      )
    ).thenReturn(cannotDodgeLog);

    when(
      mockedStringMessagesStoreService.createLostLogMessage(
        playerInfo.name,
        molotov.identity.label
      )
    ).thenReturn(lostItemLog);

    when(
      mockedStringMessagesStoreService.createOutOfDodgesLogMessage(anyString())
    ).thenReturn(outOfDodgesLog);

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

        expect(result).toEqual({ logs: [damageInteractiveLog], dodged: false });
      });
    });

    [
      {
        target: mockedActorEntity,
      },
      {
        target: mockedTargetPlayerEntity,
      },
    ].forEach(({ target }) => {
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
              logs: [usedItemLog, checkFailureLog],
              dodged: false,
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
                  usedItemLog,
                  checkSuccessLog,
                  cannotDodgeLog,
                  resultDamageLog,
                ],
                dodged: false,
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

              const unDodgeableLog = new LogMessageDefinition(
                'ATTACKED',
                'someone',
                'this cannot be dodged'
              );

              when(
                mockedStringMessagesStoreService.createUnDodgeableAttackLogMessage(
                  anyString()
                )
              ).thenReturn(unDodgeableLog);

              const result = service.execute(
                instance(mockedPlayerEntity),
                eventAttackInteractive,
                { target: instance(target) }
              );

              expect(result).toEqual({
                logs: [
                  usedItemLog,
                  checkSuccessLog,
                  unDodgeableLog,
                  resultDamageLog,
                ],
                dodged: false,
              });
            });
          });

          describe('when attack is dodgeable', () => {
            describe('when target dodges', () => {
              it('return logs and dodged', () => {
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

                const dodgedLog = new LogMessageDefinition(
                  'ATTACKED',
                  'somebody',
                  'dodged'
                );

                when(
                  mockedStringMessagesStoreService.createSkillCheckLogMessage(
                    anyString(),
                    'Dodge',
                    '15',
                    'SUCCESS'
                  )
                ).thenReturn(dodgedLog);

                const result = service.execute(actor, eventAttackInteractive, {
                  target: instance(target),
                });

                expect(result).toEqual({
                  logs: [usedItemLog, checkSuccessLog, dodgedLog],
                  dodged: true,
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

                const notDodgedLog = new LogMessageDefinition(
                  'ATTACKED',
                  'somebody',
                  'dodged'
                );

                when(
                  mockedStringMessagesStoreService.createSkillCheckLogMessage(
                    anyString(),
                    'Dodge',
                    '75',
                    'FAILURE'
                  )
                ).thenReturn(notDodgedLog);

                const result = service.execute(
                  instance(mockedPlayerEntity),
                  eventAttackInteractive,
                  { target: instance(target) }
                );

                expect(result).toEqual({
                  logs: [
                    usedItemLog,
                    checkSuccessLog,
                    notDodgedLog,
                    resultDamageLog,
                  ],
                  dodged: false,
                });
              });
            });
          });
        });
      });
    });

    describe('when weapon was disposable', () => {
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

        const result = service.execute(
          instance(mockedPlayerEntity),
          eventAttackInteractive,
          { target: instance(mockedInteractiveEntity) }
        );

        expect(result).toEqual({
          logs: [lostItemLog, damageInteractiveLog],
          dodged: false,
        });
      });
    });

    describe('when actor was out of dodges', () => {
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
              effect: new EffectEvent('KINETIC', 2),
            })
          )
        ).thenReturn(damageMessage2);

        const result = service.execute(actor, eventAttackInteractive, {
          target: instance(mockedPlayerEntity),
          targetDodgesPerformed: 2,
        });

        expect(result).toEqual({
          logs: [usedItemLog, checkSuccessLog, outOfDodgesLog, resultDamageLog],
          dodged: false,
        });
      });
    });

    describe('when actor was out of energy', () => {
      it('return log', () => {
        when(mockedPlayerEntity.weaponEquipped).thenReturn(shadowSword);

        const outOfEnergyLog = new LogMessageDefinition(
          'ACTIVATION',
          playerInfo.name,
          'outta energy'
        );
        when(
          mockedStringMessagesStoreService.createNotEnoughEnergyLogMessage(
            anyString(),
            anyString()
          )
        ).thenReturn(outOfEnergyLog);

        const result = service.execute(
          instance(mockedPlayerEntity),
          eventAttackInteractive,
          { target: instance(mockedActorEntity) }
        );

        expect(result).toEqual({
          logs: [outOfEnergyLog],
          dodged: false,
        });
      });
    });

    describe('when item requires energy to activate', () => {
      it('return log', () => {
        when(mockedPlayerEntity.weaponEquipped).thenReturn(shadowDagger);

        when(
          mockedRollService.actorSkillCheck(
            instance(mockedPlayerEntity),
            'Melee Weapon (Simple)'
          )
        ).thenReturn({ result: 'SUCCESS', roll: 10 });

        when(
          mockedRollService.actorSkillCheck(
            instance(mockedActorEntity),
            'Dodge'
          )
        ).thenReturn({ result: 'IMPOSSIBLE', roll: 0 });

        const energyDrainedLog = 'drained some energy';

        const energySpentLog = new LogMessageDefinition(
          'ACTIVATION',
          playerInfo.name,
          'spent energy'
        );

        when(
          mockedStringMessagesStoreService.createEnergyDrainedMessage(
            shadowDagger.energyActivation.toString()
          )
        ).thenReturn(energyDrainedLog);

        when(
          mockedStringMessagesStoreService.createEnergySpentLogMessage(
            playerInfo.name,
            energyDrainedLog,
            shadowDagger.identity.label
          )
        ).thenReturn(energySpentLog);

        when(
          mockedPlayerEntity.reactTo(
            service.activationAction,
            'NONE',
            deepEqual({
              energy: -shadowDagger.energyActivation,
            })
          )
        ).thenReturn(energyDrainedLog);

        when(
          mockedActorEntity.reactTo(
            deepEqual(eventAttackInteractive.actionableDefinition),
            'SUCCESS',
            deepEqual({
              effect: new EffectEvent('PROFANE', 2),
            })
          )
        ).thenReturn(damageMessage2);

        const result = service.execute(
          instance(mockedPlayerEntity),
          eventAttackInteractive,
          { target: instance(mockedActorEntity) }
        );

        expect(result).toEqual({
          logs: [
            energySpentLog,
            usedItemLog,
            checkSuccessLog,
            cannotDodgeLog,
            resultDamageLog,
          ],
          dodged: false,
        });
      });
    });
  });
});

const damageMessage2 = `${simpleSword.damage.effectType}-2`;

const damageInteractiveLog = new LogMessageDefinition(
  'ATTACKED',
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
  'ATTACKED',
  'somebody',
  damageMessage2
);

const cannotDodgeLog = new LogMessageDefinition(
  'ATTACKED',
  'target',
  'Yo cannot dodge'
);

const outOfDodgesLog = new LogMessageDefinition(
  'ATTACKED',
  'somebody',
  'out of dodges'
);

const lostItemLog = new LogMessageDefinition(
  'ATTACKED',
  playerInfo.name,
  molotov.identity.label
);

const eventAttackInteractive = actionableEvent(
  actionAttack,
  interactiveInfo.id
);

const eventAttackPlayer = actionableEvent(actionAttack, playerInfo.id);
