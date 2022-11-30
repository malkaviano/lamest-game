import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { BehaviorLiteral } from '../literals/behavior.literal';
import { ArrayView } from '../views/array.view';
import { emptyState } from './empty.state';
import { EnemyState } from './enemy.state';

describe('EnemyState', () => {
  describe('stateResult', () => {
    describe('when HP <= 0', () => {
      it('return empty state', () => {
        const result = createState().onResult(attackAction, 'SUCCESS', 12);

        expect(result).toEqual({
          state: emptyState,
          log: 'received 12 damage and was destroyed',
        });
      });
    });

    describe('when HP > 0', () => {
      it('return EnemyState with remaining HP', () => {
        const { state } = createState().onResult(attackAction, 'SUCCESS', 6);

        expect((state as EnemyState).hitPoints).toEqual(4);
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

          expect(enemy.attack).toEqual(expectedAttack);
        });
      });
    });
  });
});

const attackAction = createActionableDefinition('ATTACK', 'attack', 'Attack');

const damage = new DamageDefinition(createDice(), 1);

const weapon = new WeaponDefinition('gg', 'claw', '', 'Brawl', damage, true);

const expectedAttack = {
  skillValue: 25,
  damage,
  dodgeable: true,
  weaponName: 'claw',
};

const f = () => emptyState;

const lazy = new LazyHelper(f);

const createState = (
  behavior: BehaviorLiteral = 'AGGRESSIVE',
  hp: number = 10
) =>
  new EnemyState(new ArrayView([attackAction]), lazy, hp, weapon, 25, behavior);
