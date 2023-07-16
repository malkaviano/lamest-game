import { deepEqual, instance, when } from 'ts-mockito';

import { ActorEntity } from '@entities/actor.entity';
import { ArrayView } from '@wrappers/array.view';
import { ActorIdentityDefinition } from '@definitions/actor-identity.definition';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { clothArmor, unarmedWeapon } from '@behaviors/equipment.behavior';
import { CheckResultLiteral } from '@literals/check-result.literal';
import {
  CurrentAPChangedEvent,
  CurrentEPChangedEvent,
  CurrentHPChangedEvent,
  DerivedAttributeEvent,
} from '@events/derived-attribute.event';
import {
  ArmorChangedEvent,
  WeaponChangedEvent,
} from '@events/equipment-changed.event';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ArmorDefinition } from '@definitions/armor.definition';

import {
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeSkills,
  fakeSceneActorsInfo,
  simpleSword,
  actionAffect,
  fakeEffect,
  actionConsume,
  playerInfo,
  actionableEvent,
  actionPickAnalgesic,
  superbSword,
  unDodgeableAxe,
  kevlarVest,
  leatherJacket,
} from '../../../tests/fakes';
import {
  mockedActionableState,
  mockedActionableState2,
  mockedActorBehavior,
  mockedAiBehavior,
  mockedRegeneratorBehavior,
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

    when(mockedEquipmentBehavior.changeWeapon(simpleSword)).thenReturn(null);

    when(mockedActorBehavior.dodgesPerRound).thenReturn(1);

    when(
      mockedAiBehavior.action(
        deepEqual(fakeSceneActorsInfo),
        deepEqual([playerInfo.id])
      )
    ).thenReturn(eventAttackPlayer);

    when(mockedActionableState.actions).thenReturn(ArrayView.empty());

    when(mockedActionableState2.actions).thenReturn(ArrayView.empty());
  });

  describe('derivedAttributes', () => {
    it('return HP 9, EP 13, MOV 10', () => {
      expect(fakeActor().derivedAttributes).toEqual(fakeDerivedAttributes);
    });
  });

  describe('skills', () => {
    it('return skills', () => {
      expect(fakeActor().skills).toEqual(fakeSkills);
    });

    it('return skill value with weapon modifier ', () => {
      when(mockedEquipmentBehavior.weaponEquipped).thenReturn(superbSword);

      const actor = fakeActor();

      expect(actor.skills['Melee Weapon (Simple)']).toEqual(75);
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
              event: new CurrentHPChangedEvent(9, 0),
              log: acid9Log,
            },
            {
              event: new CurrentHPChangedEvent(9, 9),
              log: hpNotChangedLog,
            },
          ].forEach(({ event, log }) => {
            it('return damage taken', () => {
              when(
                mockedActorBehavior.effectReceived(
                  deepEqual(fakeEffect('ACID', 10))
                )
              ).thenReturn(event);

              const result = fakeActor().reactTo(actionAffect, 'SUCCESS', {
                effect: fakeEffect('ACID', 10),
              });

              expect(result).toEqual(log);
            });
          });

          it('should emit an event', (done) => {
            const result: DerivedAttributeEvent[] = [];

            when(
              mockedActorBehavior.effectReceived(
                deepEqual(fakeEffect('ACID', 6))
              )
            ).thenReturn(new CurrentHPChangedEvent(9, 3));

            const char = fakeActor();

            char.derivedAttributeChanged$.subscribe((event) => {
              result.push(event);
            });

            char.reactTo(actionAffect, 'SUCCESS', {
              effect: fakeEffect('ACID', 6),
            });

            done();

            expect(result).toEqual([new CurrentHPChangedEvent(9, 3)]);
          });
        });

        ['FAILURE', 'NONE', 'IMPOSSIBLE'].forEach((result) => {
          describe(`attack was ${result}`, () => {
            it('return nothing', () => {
              const log = fakeActor().reactTo(
                actionAffect,
                result as CheckResultLiteral,
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
          ArrayView.create(actionPickAnalgesic)
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
          resultHpEvent: new CurrentHPChangedEvent(4, 9),
          energy: 0,
          resultEpEvent: new CurrentEPChangedEvent(6, 6),
          resultLog: remedy5Log,
          eventEmitted: [new CurrentHPChangedEvent(4, 9)],
        },
        {
          result: 'NONE',
          effect: fakeEffect('REMEDY', 10),
          mockedEffect: fakeEffect('REMEDY', 10),
          resultHpEvent: new CurrentHPChangedEvent(4, 9),
          energy: 4,
          resultEpEvent: new CurrentEPChangedEvent(2, 6),
          resultLog: `${remedy5Log} and ${energized4Log}`,
          eventEmitted: [
            new CurrentHPChangedEvent(4, 9),
            new CurrentEPChangedEvent(2, 6),
          ],
        },
        {
          result: 'NONE',
          effect: fakeEffect('REMEDY', 10),
          mockedEffect: fakeEffect('REMEDY', 10),
          resultHpEvent: new CurrentHPChangedEvent(9, 9),
          energy: 4,
          resultEpEvent: new CurrentEPChangedEvent(6, 6),
          resultLog: `${hpNotChangedLog} and ${epNotChangedLog}`,
          eventEmitted: [],
        },
        {
          result: 'SUCCESS',
          effect: undefined,
          mockedEffect: fakeEffect('REMEDY', 10),
          resultHpEvent: new CurrentHPChangedEvent(9, 9),
          energy: -4,
          resultEpEvent: new CurrentEPChangedEvent(6, 2),
          resultLog: drained4Log,
          eventEmitted: [new CurrentEPChangedEvent(6, 2)],
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
          eventEmitted,
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
                result as CheckResultLiteral,
                { effect, energy }
              );

              expect(log).toEqual(resultLog);
            });
          });

          it('should emit derived attribute events', (done) => {
            const eventResult: DerivedAttributeEvent[] = [];

            when(
              mockedActorBehavior.effectReceived(deepEqual(mockedEffect))
            ).thenReturn(resultHpEvent);

            when(mockedActorBehavior.energyChange(energy)).thenReturn(
              resultEpEvent
            );

            const char = fakeActor();

            char.derivedAttributeChanged$.subscribe((event) => {
              eventResult.push(event);
            });

            char.reactTo(actionConsume, result as CheckResultLiteral, {
              effect,
              energy,
            });

            done();

            expect(eventResult).toEqual(eventEmitted);
          });
        }
      );

      ['IMPOSSIBLE', 'FAILURE'].forEach((result) => {
        describe(`heal was ${result}`, () => {
          it('return nothing', () => {
            const log = fakeActor().reactTo(
              actionConsume,
              result as CheckResultLiteral,
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

          return new CurrentHPChangedEvent(10, 0);
        });

        const char = fakeActor();

        char.reactTo(actionAffect, 'SUCCESS', {
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
    it('return previous weapon', () => {
      const char = fakeActor();

      const f = () => char.equip(simpleSword);

      testWeaponAction(f, unDodgeableAxe, simpleSword);
    });

    it('emit event', (done) => {
      const char = fakeActor();

      const f = () => char.equip(simpleSword);

      testWeaponEvent(char, f, done, unDodgeableAxe, simpleSword);
    });
  });

  describe('unEquip', () => {
    it('return previous weapon', () => {
      const char = fakeActor();

      const f = () => char.unEquip();

      testWeaponAction(f, simpleSword);
    });

    it('should emit event', (done) => {
      const char = fakeActor();

      const f = () => char.unEquip();

      testWeaponEvent(char, f, done, simpleSword);
    });
  });

  describe('action', () => {
    it('return action attack', () => {
      const actor = fakeActor();

      actor.afflictedBy(playerInfo.id);

      expect(actor.action(fakeSceneActorsInfo)).toEqual(eventAttackPlayer);
    });

    it('return action null', () => {
      expect(fakeActor().action(ArrayView.empty())).toBeNull();
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

  describe('ignores', () => {
    it('return DISGUISED', () => {
      expect(fakeActor().ignores).toEqual(ArrayView.create('DISGUISED'));
    });
  });

  describe('apSpent', () => {
    it('emits ActionPointsEvent', (done) => {
      const actor = fakeActor();

      const expected = new CurrentAPChangedEvent(10, 5);

      apEventTest(actor, done, -5, () => actor.apSpent(5), expected);
    });
  });

  describe('apRecovered', () => {
    it('emits ActionPointsEvent', (done) => {
      const actor = fakeActor();

      const expected = new CurrentAPChangedEvent(5, 12);

      apEventTest(actor, done, 7, () => actor.apRecovered(7), expected);
    });
  });

  describe('wear', () => {
    it('return previous armor', () => {
      const char = fakeActor();

      const f = () => char.wear(leatherJacket);

      testArmorAction(f, kevlarVest, leatherJacket);
    });

    it('emit event', (done) => {
      const char = fakeActor();

      const f = () => char.wear(leatherJacket);

      testArmorEvent(char, f, done, kevlarVest, leatherJacket);
    });
  });

  describe('strip', () => {
    it('return previous armor', () => {
      const char = fakeActor();

      const f = () => char.strip();

      testArmorAction(f, leatherJacket);
    });

    it('should emit event', (done) => {
      const char = fakeActor();

      const f = () => char.strip();

      testArmorEvent(char, f, done, leatherJacket);
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
      regeneratorBehavior: instance(mockedRegeneratorBehavior),
      aiBehavior: instance(mockedAiBehavior),
    }
  );

const eventAttackPlayer = actionableEvent(actionAffect, playerInfo.id);

function testWeaponEvent(
  char: ActorEntity,
  action: () => WeaponDefinition | null,
  done: DoneFn,
  previous: WeaponDefinition,
  current?: WeaponDefinition
) {
  let result: WeaponChangedEvent | ArmorChangedEvent | undefined;

  when(mockedEquipmentBehavior.changeWeapon(current)).thenReturn(previous);

  char.equipmentChanged$.subscribe((event) => {
    result = event;
  });

  action();

  done();

  expect(result).toEqual(
    new WeaponChangedEvent(previous, current ?? unarmedWeapon)
  );
}

function testWeaponAction(
  action: () => WeaponDefinition | null,
  previous: WeaponDefinition,
  current?: WeaponDefinition
) {
  when(mockedEquipmentBehavior.changeWeapon(current)).thenReturn(previous);

  const result = action();

  expect(result).toEqual(previous);
}

function apEventTest(
  actor: ActorEntity,
  done: DoneFn,
  ap: number,
  action: () => void,
  expected: DerivedAttributeEvent
) {
  let result: DerivedAttributeEvent | undefined;

  when(mockedActorBehavior.actionPointsChange(ap)).thenReturn(expected);

  actor.derivedAttributeChanged$.subscribe((event) => {
    result = event;
  });

  action();

  done();

  expect(result).toEqual(expected);
}

function testArmorAction(
  action: () => ArmorDefinition | null,
  previous: ArmorDefinition,
  current?: ArmorDefinition
) {
  when(mockedEquipmentBehavior.changeArmor(current)).thenReturn(previous);

  const result = action();

  expect(result).toEqual(previous);
}

function testArmorEvent(
  char: ActorEntity,
  action: () => ArmorDefinition | null,
  done: DoneFn,
  previous: ArmorDefinition,
  current?: ArmorDefinition
) {
  let result: WeaponChangedEvent | ArmorChangedEvent | undefined;

  when(mockedEquipmentBehavior.changeArmor(current)).thenReturn(previous);

  char.equipmentChanged$.subscribe((event) => {
    result = event;
  });

  action();

  done();

  expect(result).toEqual(
    new ArmorChangedEvent(previous, current ?? clothArmor)
  );
}
