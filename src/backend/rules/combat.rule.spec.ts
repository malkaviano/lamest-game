import { TestBed } from '@angular/core/testing';

import { anything, deepEqual, instance, verify, when } from 'ts-mockito';

import { CombatRule } from './combat.rule';
import { RollService } from '../services/roll.service';
import { CheckedHelper } from '../helpers/checked.helper';
import { ActivationAxiomService } from '../axioms/activation.axiom.service';
import { DodgeAxiomService } from '../axioms/dodge.axiom.service';
import { AffectAxiomService } from '../axioms/affect.axiom.service';
import { GameStringsStore } from '../../stores/game-strings.store';
import { RollDefinition } from '../../core/definitions/roll.definition';
import { EffectEvent } from '../../core/events/effect.event';

import { ruleScenario } from '../../../tests/scenarios';
import {
  mockedActivationAxiomService,
  mockedActorEntity,
  mockedAffectedAxiomService,
  mockedCheckedHelper,
  mockedDodgeAxiomService,
  mockedPlayerEntity,
  mockedRollService,
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
        {
          provide: CheckedHelper,
          useValue: instance(mockedCheckedHelper),
        },
        {
          provide: ActivationAxiomService,
          useValue: instance(mockedActivationAxiomService),
        },
        {
          provide: DodgeAxiomService,
          useValue: instance(mockedDodgeAxiomService),
        },
        {
          provide: AffectAxiomService,
          useValue: instance(mockedAffectedAxiomService),
        },
      ],
    });

    setupMocks();

    when(mockedRollService.roll(simpleSword.damage.diceRoll)).thenReturn(0);

    when(mockedRollService.roll(unDodgeableAxe.damage.diceRoll)).thenReturn(0);

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

    service = TestBed.inject(CombatRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
              mockedRollService.actorSkillCheck(actor, 'Ranged Weapon (Throw)')
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
              service,
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
              mockedRollService.actorSkillCheck(actor, 'Ranged Weapon (Throw)')
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
                mockedRollService.actorSkillCheck(
                  actor,
                  'Melee Weapon (Simple)'
                )
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
                service,
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
