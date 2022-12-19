import { take } from 'rxjs';
import { deepEqual, instance, when } from 'ts-mockito';

import { HitPointsEvent } from '../events/hit-points.event';
import { ActionableDefinition } from '../definitions/actionable.definition';
import {
  createEffectDamagedMessage,
  createEffectRestoredHPMessage,
  createEnergizedMessage,
  createEnergyDidNotChangeMessage,
  createEnergyDrainedMessage,
  createHPDidNotChangeMessage,
} from '../definitions/log-message.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActorEntity } from './actor.entity';
import { emptyState } from '../states/empty.state';
import { ArrayView } from '../views/array.view';
import { ActorIdentityDefinition } from '../definitions/actor-identity.definition';
import {
  unarmedWeapon,
  WeaponDefinition,
} from '../definitions/weapon.definition';
import { EnergyPointsEvent } from '../events/energy-points.event';

import {
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeSkills,
  fakeSceneActorsInfo,
  simpleSword,
  actionAttack,
  fakeEffect,
  actionConsume,
  playerInfo,
  actionableEvent,
} from '../../../tests/fakes';
import {
  mockedActorBehavior,
  mockedEquipmentBehavior,
  setupMocks,
} from '../../../tests/mocks';

describe('ActorEntity', () => {
  beforeEach(() => {
    setupMocks();

    when(mockedEquipmentBehavior.equip(simpleSword)).thenReturn(null);

    when(mockedActorBehavior.dodgesPerRound).thenReturn(1);
  });

  describe('derivedAttributes', () => {
    it('return HP 9, EP 13, MOV 10', () => {
      expect(fakeActor().derivedAttributes).toEqual(fakeDerivedAttributes);
    });
  });

  describe('skill', () => {
    it('return skills', () => {
      expect(fakeActor().skills).toEqual(fakeSkills);
    });
  });

  describe('characteristics', () => {
    it('return characteristics', () => {
      expect(fakeActor().characteristics).toEqual(fakeCharacteristics);
    });
  });

  describe('classification', () => {
    it('return ACTOR', () => {
      expect(fakeActor().classification).toEqual('ACTOR');
    });
  });

  describe('reactTo', () => {
    describe('when ALIVE', () => {
      describe('when damage taken', () => {
        describe('attack was SUCCESS', () => {
          [
            {
              event: new HitPointsEvent(9, 0),
              log: createEffectDamagedMessage(9, 'ACID'),
            },
            {
              event: new HitPointsEvent(9, 9),
              log: createHPDidNotChangeMessage(),
            },
          ].forEach(({ event, log }) => {
            it('return damage taken', () => {
              when(
                mockedActorBehavior.effectReceived(
                  deepEqual(fakeEffect('ACID', 10))
                )
              ).thenReturn(event);

              const result = fakeActor().reactTo(actionAttack, 'SUCCESS', {
                effect: fakeEffect('ACID', 10),
              });

              expect(result).toEqual(log);
            });
          });

          it('should emit an event', (done) => {
            let result: HitPointsEvent | undefined;

            when(
              mockedActorBehavior.effectReceived(
                deepEqual(fakeEffect('ACID', 6))
              )
            ).thenReturn(new HitPointsEvent(9, 3));

            const char = fakeActor();

            char.hpChanged$.pipe(take(10)).subscribe((event) => {
              result = event;
            });

            char.reactTo(actionAttack, 'SUCCESS', {
              effect: fakeEffect('ACID', 6),
            });

            done();

            expect(result).toEqual(new HitPointsEvent(9, 3));
          });
        });

        ['FAILURE', 'NONE', 'IMPOSSIBLE'].forEach((result) => {
          describe(`attack was ${result}`, () => {
            it('return nothing', () => {
              const log = fakeActor().reactTo(
                actionAttack,
                result as ResultLiteral,
                deepEqual({ effect: fakeEffect('ACID', 1) })
              );

              expect(log).toBeNull();
            });
          });
        });
      });
    });

    describe('when DEAD', () => {
      it('should emit actions changed event', (done) => {
        when(mockedActorBehavior.situation).thenReturn('DEAD');

        let result: ArrayView<ActionableDefinition> | undefined;

        const char = fakeActor();

        char.actionsChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        char.reactTo(actionAttack, 'SUCCESS', {
          effect: fakeEffect('ACID', 6),
        });

        done();

        expect(result).toEqual(ArrayView.create([]));
      });
    });

    describe('when consume', () => {
      [
        {
          result: 'SUCCESS',
          effect: fakeEffect('REMEDY', 10),
          mockedEffect: fakeEffect('REMEDY', 10),
          resultHpEvent: new HitPointsEvent(4, 9),
          energy: 0,
          resultEpEvent: new EnergyPointsEvent(6, 6),
          resultLog: `${createEffectRestoredHPMessage('REMEDY', 5)}`,
          hpEventEmitted: new HitPointsEvent(4, 9),
          epEventEmitted: undefined,
        },
        {
          result: 'NONE',
          effect: fakeEffect('REMEDY', 10),
          mockedEffect: fakeEffect('REMEDY', 10),
          resultHpEvent: new HitPointsEvent(4, 9),
          energy: 4,
          resultEpEvent: new EnergyPointsEvent(2, 6),
          resultLog: `${createEffectRestoredHPMessage(
            'REMEDY',
            5
          )} and ${createEnergizedMessage(4)}`,
          hpEventEmitted: new HitPointsEvent(4, 9),
          epEventEmitted: new EnergyPointsEvent(2, 6),
        },
        {
          result: 'NONE',
          effect: fakeEffect('REMEDY', 10),
          mockedEffect: fakeEffect('REMEDY', 10),
          resultHpEvent: new HitPointsEvent(9, 9),
          energy: 4,
          resultEpEvent: new EnergyPointsEvent(6, 6),
          resultLog: `${createHPDidNotChangeMessage()} and ${createEnergyDidNotChangeMessage()}`,
          hpEventEmitted: undefined,
          epEventEmitted: undefined,
        },
        {
          result: 'SUCCESS',
          effect: undefined,
          mockedEffect: fakeEffect('REMEDY', 10),
          resultHpEvent: new HitPointsEvent(9, 9),
          energy: -4,
          resultEpEvent: new EnergyPointsEvent(6, 2),
          resultLog: `${createEnergyDrainedMessage(4)}`,
          hpEventEmitted: undefined,
          epEventEmitted: new EnergyPointsEvent(6, 2),
        },
      ].forEach(
        ({
          result,
          effect,
          mockedEffect,
          resultHpEvent,
          energy,
          resultEpEvent,
          resultLog,
          hpEventEmitted,
          epEventEmitted,
        }) => {
          describe(`action was ${result}`, () => {
            it('return result logs', () => {
              when(
                mockedActorBehavior.effectReceived(deepEqual(mockedEffect))
              ).thenReturn(resultHpEvent);

              when(mockedActorBehavior.energyChange(energy)).thenReturn(
                resultEpEvent
              );

              const log = fakeActor().reactTo(
                actionConsume,
                result as ResultLiteral,
                { effect, energy }
              );

              expect(log).toEqual(resultLog);
            });
          });

          it('should emit an HP event', (done) => {
            let hpResult: HitPointsEvent | undefined;

            when(
              mockedActorBehavior.effectReceived(deepEqual(mockedEffect))
            ).thenReturn(resultHpEvent);

            when(mockedActorBehavior.energyChange(energy)).thenReturn(
              resultEpEvent
            );

            const char = fakeActor();

            char.hpChanged$.pipe(take(10)).subscribe((event) => {
              hpResult = event;
            });

            char.reactTo(actionConsume, result as ResultLiteral, {
              effect,
              energy,
            });

            done();

            expect(hpResult).toEqual(hpEventEmitted);
          });

          it('should emit an EP event', (done) => {
            let epResult: EnergyPointsEvent | undefined;

            when(
              mockedActorBehavior.effectReceived(deepEqual(mockedEffect))
            ).thenReturn(resultHpEvent);

            when(mockedActorBehavior.energyChange(energy)).thenReturn(
              resultEpEvent
            );

            const char = fakeActor();

            char.epChanged$.pipe(take(10)).subscribe((event) => {
              epResult = event;
            });

            char.reactTo(actionConsume, result as ResultLiteral, {
              effect,
              energy,
            });

            done();

            expect(epResult).toEqual(epEventEmitted);
          });
        }
      );

      ['IMPOSSIBLE', 'FAILURE'].forEach((result) => {
        describe(`heal was ${result}`, () => {
          it('return nothing', () => {
            const log = fakeActor().reactTo(
              actionConsume,
              result as ResultLiteral,
              deepEqual({ effect: fakeEffect('REMEDY', 1) })
            );

            expect(log).toBeNull();
          });
        });
      });
    });
  });

  describe('weaponEquipped', () => {
    it('return current weapon', () => {
      when(mockedEquipmentBehavior.weaponEquipped).thenReturn(unarmedWeapon);

      expect(fakeActor().weaponEquipped).toEqual(unarmedWeapon);
    });
  });

  describe('equip', () => {
    it('should equip new weapon', () => {
      when(mockedEquipmentBehavior.weaponEquipped).thenReturn(simpleSword);

      const char = fakeActor();

      equipActorScenario(char, simpleSword);

      expect(char.weaponEquipped).toEqual(simpleSword);
    });

    it('should emit event', (done) => {
      let result: WeaponDefinition | undefined;

      const char = fakeActor();

      char.weaponEquippedChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      equipActorScenario(char, simpleSword);

      done();

      expect(result).toEqual(simpleSword);
    });
  });

  describe('unEquip', () => {
    it('should un-equip current weapon', () => {
      when(mockedEquipmentBehavior.unEquip()).thenReturn(simpleSword);

      const char = fakeActor();

      const result = unEquipActorScenario(char);

      expect(result).toEqual(simpleSword);
    });

    it('should emit event', (done) => {
      when(mockedEquipmentBehavior.unEquip()).thenReturn(simpleSword);

      let result: WeaponDefinition | undefined;

      const char = fakeActor();

      char.weaponEquippedChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      unEquipActorScenario(char);

      done();

      expect(result).toEqual(simpleSword);
    });
  });

  describe('action', () => {
    it('return action attack', () => {
      expect(fakeActor().action(fakeSceneActorsInfo)).toEqual(
        eventAttackPlayer
      );
    });

    it('return action null', () => {
      expect(fakeActor().action(ArrayView.create([]))).toBeNull();
    });
  });

  describe('dodgesPerRound', () => {
    it('return 1', () => {
      expect(fakeActor().dodgesPerRound).toEqual(1);
    });
  });

  describe('visibility', () => {
    describe('current', () => {
      it('return VISIBLE', () => {
        expect(fakeActor().visibility).toEqual('VISIBLE');
      });
    });

    describe('set visibility', () => {
      it('return DISGUISED', () => {
        const actor = fakeActor();

        actor.visibility = 'DISGUISED';

        expect(actor.visibility).toEqual('DISGUISED');
      });
    });
  });
});

const fakeActor = () =>
  new ActorEntity(
    new ActorIdentityDefinition('id1', 'actor', 'Some Actor'),
    emptyState,
    false,
    instance(mockedActorBehavior),
    instance(mockedEquipmentBehavior),
    emptyState
  );

const equipActorScenario = (
  character: ActorEntity,
  weapon: WeaponDefinition
): WeaponDefinition | null => {
  const previous = character.equip(weapon);

  return previous;
};

const unEquipActorScenario = (
  character: ActorEntity
): WeaponDefinition | null => {
  return character.unEquip();
};

const eventAttackPlayer = actionableEvent(actionAttack, playerInfo.id);
