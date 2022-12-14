import { take } from 'rxjs';
import { deepEqual, instance, when } from 'ts-mockito';

import { HitPointsEvent } from '../events/hitpoints.event';
import { ActionableDefinition } from '../definitions/actionable.definition';
import {
  createDamagedMessage,
  createHealedMessage,
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

import {
  eventAttackPlayer,
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeSkills,
  fakeSceneActorsInfo,
  simpleSword,
  actionHeal,
  actionAttack,
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
          it('return damage taken', () => {
            when(mockedActorBehavior.damaged(10)).thenReturn(
              new HitPointsEvent(9, 0)
            );

            const result = fakeActor().reactTo(actionAttack, 'SUCCESS', {
              damage: 10,
            });

            expect(result).toEqual(logAttacked);
          });

          it('should emit an event', (done) => {
            let result: HitPointsEvent | undefined;

            when(mockedActorBehavior.damaged(6)).thenReturn(
              new HitPointsEvent(9, 3)
            );

            const char = fakeActor();

            char.hpChanged$.pipe(take(10)).subscribe((event) => {
              result = event;
            });

            char.reactTo(actionAttack, 'SUCCESS', { damage: 6 });

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
                deepEqual({ damage: 1 })
              );

              expect(log).not.toBeDefined();
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

        char.reactTo(actionAttack, 'SUCCESS', { damage: 6 });

        done();

        expect(result).toEqual(new ArrayView([]));
      });
    });

    describe('when heal received', () => {
      ['SUCCESS', 'NONE'].forEach((result) => {
        describe(`heal was ${result}`, () => {
          it('return heal received', () => {
            when(mockedActorBehavior.healed(10)).thenReturn(
              new HitPointsEvent(4, 9)
            );

            const log = fakeActor().reactTo(
              actionHeal,
              result as ResultLiteral,
              { heal: 10 }
            );

            expect(log).toEqual(logHealed);
          });
        });

        it('should emit an event', (done) => {
          let hpResult: HitPointsEvent | undefined;

          when(mockedActorBehavior.healed(5)).thenReturn(
            new HitPointsEvent(6, 9)
          );

          const char = fakeActor();

          char.hpChanged$.pipe(take(10)).subscribe((event) => {
            hpResult = event;
          });

          char.reactTo(actionHeal, result as ResultLiteral, { heal: 5 });

          done();

          expect(hpResult).toEqual(new HitPointsEvent(6, 9));
        });
      });

      ['IMPOSSIBLE', 'FAILURE'].forEach((result) => {
        describe(`heal was ${result}`, () => {
          it('return nothing', () => {
            const log = fakeActor().reactTo(
              actionHeal,
              result as ResultLiteral,
              deepEqual({ heal: 1 })
            );

            expect(log).not.toBeDefined();
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
      expect(fakeActor().action(new ArrayView([]))).toBeNull();
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

const logAttacked = createDamagedMessage(9);

const logHealed = createHealedMessage(5);

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
