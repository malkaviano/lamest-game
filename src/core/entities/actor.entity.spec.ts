import { deepEqual, instance, when } from 'ts-mockito';

import { ResultLiteral } from '../literals/result.literal';
import { ActorEntity } from './actor.entity';
import { ArrayView } from '../view-models/array.view';
import { ActorIdentityDefinition } from '../definitions/actor-identity.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { VisibilityLiteral } from '../literals/visibility.literal';
import { HitPointsEvent } from '../events/hit-points.event';
import { EnergyPointsEvent } from '../events/energy-points.event';
import { unarmedWeapon } from '../behaviors/equipment.behavior';

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
  actionPickAnalgesic,
} from '../../../tests/fakes';
import {
  mockedActionableState,
  mockedActionableState2,
  mockedActorBehavior,
  mockedAiBehavior,
  mockedCooldownBehavior,
  mockedEquipmentBehavior,
  setupMocks,
} from '../../../tests/mocks';

const remedy5Log = 'received REMEDY effect, healed 5 hp';

const energized4Log = 'restored 4 energy';

const hpNotChangedLog = 'HP did not change';

const epNotChangedLog = 'EP did not change';

const drained4Log = 'lost 4 energy';

const acid9Log = 'received 9 ACID damage';

describe('ActorEntity', () => {
  beforeEach(() => {
    setupMocks();

    when(mockedEquipmentBehavior.equip(simpleSword)).thenReturn(null);

    when(mockedActorBehavior.dodgesPerRound).thenReturn(1);

    when(
      mockedAiBehavior.action(
        deepEqual(fakeSceneActorsInfo),
        deepEqual([playerInfo.id])
      )
    ).thenReturn(eventAttackPlayer);

    when(mockedActionableState.actions).thenReturn(ArrayView.create([]));

    when(mockedActionableState2.actions).thenReturn(ArrayView.create([]));
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
              log: acid9Log,
            },
            {
              event: new HitPointsEvent(9, 9),
              log: hpNotChangedLog,
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
            const result: HitPointsEvent[] = [];

            when(
              mockedActorBehavior.effectReceived(
                deepEqual(fakeEffect('ACID', 6))
              )
            ).thenReturn(new HitPointsEvent(9, 3));

            const char = fakeActor();

            char.hpChanged$.subscribe((event) => {
              result.push(event);
            });

            char.reactTo(actionAttack, 'SUCCESS', {
              effect: fakeEffect('ACID', 6),
            });

            done();

            expect(result).toEqual([new HitPointsEvent(9, 3)]);
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
      it('should invoke interactive reactTo', () => {
        when(mockedActorBehavior.situation).thenReturn('DEAD');

        const char = fakeActor();

        when(mockedActionableState.actions).thenReturn(
          ArrayView.create([actionPickAnalgesic])
        );

        when(
          mockedActionableState.onResult(
            actionPickAnalgesic,
            'NONE',
            deepEqual({})
          )
        ).thenReturn({ state: killedState, log: 'invoked' });

        const result = char.reactTo(actionPickAnalgesic, 'NONE', {});

        expect(result).toEqual('invoked');
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
          resultLog: remedy5Log,
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
          resultLog: `${remedy5Log} and ${energized4Log}`,
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
          resultLog: `${hpNotChangedLog} and ${epNotChangedLog}`,
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
          resultLog: drained4Log,
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

            char.hpChanged$.subscribe((event) => {
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

            char.epChanged$.subscribe((event) => {
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

    describe('when died', () => {
      it('should change to killed state', () => {
        when(mockedActorBehavior.situation).thenReturn('ALIVE');

        when(
          mockedActorBehavior.effectReceived(deepEqual(fakeEffect('ACID', 10)))
        ).thenCall(() => {
          when(mockedActorBehavior.situation).thenReturn('DEAD');

          return new HitPointsEvent(10, 0);
        });

        const char = fakeActor();

        char.reactTo(actionAttack, 'SUCCESS', {
          effect: fakeEffect('ACID', 10),
        });

        expect(char.situation).toEqual('DEAD');
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

      char.weaponEquippedChanged$.subscribe((event) => {
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

      char.weaponEquippedChanged$.subscribe((event) => {
        result = event;
      });

      unEquipActorScenario(char);

      done();

      expect(result).toEqual(simpleSword);
    });
  });

  describe('action', () => {
    it('return action attack', () => {
      const actor = fakeActor();

      actor.afflictedBy(playerInfo.id);

      expect(actor.action(fakeSceneActorsInfo)).toEqual(eventAttackPlayer);
    });

    it('return action null', () => {
      expect(fakeActor().action(ArrayView.create([]))).toBeNull();
    });

    describe('when canAct is false', () => {
      it('return action null', () => {
        const actor = fakeActor();

        actor.afflictedBy(playerInfo.id);

        when(mockedCooldownBehavior.canAct).thenReturn(false);

        expect(actor.action(fakeSceneActorsInfo)).toBeNull();
      });
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

        actor.changeVisibility('DISGUISED');

        expect(actor.visibility).toEqual('DISGUISED');
      });

      it('emits DISGUISED', (done) => {
        const actor = fakeActor();

        let result: VisibilityLiteral = 'VISIBLE';

        actor.visibilityChanged$.subscribe((event) => {
          result = event;
          done();
        });

        actor.changeVisibility('DISGUISED');

        expect(result).toEqual('DISGUISED');
      });
    });
  });

  describe('wannaDodge', () => {
    it('return true', () => {
      when(mockedActorBehavior.wannaDodge('FIRE')).thenReturn(true);

      expect(fakeActor().wannaDodge('FIRE')).toEqual(true);
    });
  });

  describe('behavior', () => {
    it('return ACTOR', () => {
      expect(fakeActor().behavior).toEqual('AGGRESSIVE');
    });
  });
});

const killedState = instance(mockedActionableState2);

const fakeActor = () =>
  new ActorEntity(
    new ActorIdentityDefinition('id1', 'actor', 'Some Actor', 'VISIBLE'),
    instance(mockedActionableState),
    false,
    instance(mockedActorBehavior),
    instance(mockedEquipmentBehavior),
    killedState,
    {
      cooldownBehavior: instance(mockedCooldownBehavior),
      aiBehavior: instance(mockedAiBehavior),
    }
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
