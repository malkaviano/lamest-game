import { instance, mock, when } from 'ts-mockito';

import { ActorBehavior } from '../behaviors/actor.behavior';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { createDice } from '../definitions/dice.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { LazyHelper } from '../helpers/lazy.helper';
import { EnemyBehaviorLiteral } from '../literals/enemy-behavior.literal';
import { ArrayView } from '../views/array.view';
import { emptyState } from './empty.state';
import { EnemyState } from './enemy.state';

describe('EnemyState', () => {
  describe('hitpoints', () => {
    it('return 12', () => {
      when(mockedActorBehavior.derivedAttributes).thenReturn({
        HP: new DerivedAttributeDefinition('HP', 12),
        PP: new DerivedAttributeDefinition('PP', 5),
        MOV: new DerivedAttributeDefinition('MOV', 8),
      });

      expect(createState().hitPoints).toEqual(12);
    });
  });

  describe('stateResult', () => {
    describe('when HP reaches 0', () => {
      it('return empty state with killed log', () => {
        when(mockedActorBehavior.damaged(12)).thenReturn(
          new HitPointsEvent(12, 0)
        );

        const result = createState().onResult(attackAction, 'SUCCESS', 12);

        expect(result).toEqual({
          state: emptyState,
          log: 'received 12 damage and was killed',
        });
      });
    });

    describe('when HP is above 0', () => {
      it('return EnemyState with remaining HP', () => {
        when(mockedActorBehavior.damaged(6)).thenReturn(
          new HitPointsEvent(12, 6)
        );

        const state = createState();

        const result = state.onResult(attackAction, 'SUCCESS', 6);

        expect(result).toEqual({
          state,
          log: 'received 6 damage',
        });
      });
    });
  });

  describe('attack behavior', () => {
    describe('when RETALIATE', () => {
      describe('when not attacked', () => {
        it('return null', () => {
          const enemy = createState('RETALIATE');

          expect(enemy.attack).toBeNull();
        });
      });

      describe('when attacked', () => {
        it('return attack', () => {
          const enemy = createState('RETALIATE');

          when(mockedActorBehavior.damaged(1)).thenReturn(
            new HitPointsEvent(12, 11)
          );

          when(mockedActorBehavior.skills).thenReturn({
            Brawl: 25,
          });

          enemy.onResult(attackAction, 'SUCCESS', 1);

          expect(enemy.attack).toEqual(expectedAttack);

          expect(enemy.attack).toBeNull();
        });
      });
    });

    describe('when AGGRESSIVE', () => {
      describe('always attack', () => {
        it('should attack', () => {
          const enemy = createState('AGGRESSIVE');

          when(mockedActorBehavior.skills).thenReturn({
            Brawl: 25,
          });

          expect(enemy.attack).toEqual(expectedAttack);
        });
      });
    });
  });
});

const attackAction = createActionableDefinition('ATTACK', 'attack', 'Attack');

const damage = new DamageDefinition(createDice(), 1);

const weapon = new WeaponDefinition(
  'gg',
  'claw',
  '',
  'Brawl',
  damage,
  true,
  'PERMANENT'
);

const expectedAttack = {
  skillValue: 25,
  weapon,
};

const f = () => emptyState;

const lazy = new LazyHelper(f);

const mockedActorBehavior = mock(ActorBehavior);

const createState = (behavior: EnemyBehaviorLiteral = 'AGGRESSIVE') =>
  new EnemyState(
    new ArrayView([attackAction]),
    lazy,
    weapon,
    behavior,
    instance(mockedActorBehavior)
  );
