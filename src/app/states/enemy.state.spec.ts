import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { LazyHelper } from '../helpers/lazy.helper';
import { ArrayView } from '../views/array.view';
import { emptyState } from './empty.state';
import { EnemyState } from './enemy.state';

describe('EnemyState', () => {
  describe('stateResult', () => {
    describe('when HP <= 0', () => {
      it('return empty state', () => {
        const result = state().onResult(attackAction, 'SUCCESS', 12);

        expect(result).toEqual({
          state: emptyState,
          log: 'received 12 damage and was destroyed',
        });
      });
    });

    describe('when HP > 0', () => {
      it('return EnemyState with remaining HP', () => {
        const result = state().onResult(attackAction, 'SUCCESS', 6);

        expect(result).toEqual({ state: state2(), log: 'received 6 damage' });
      });
    });

    describe('when no damage is taken', () => {
      it('return EnemyState with same HP', () => {
        const result = state().onResult(attackAction, 'SUCCESS');

        expect(result).toEqual({ state: state(), log: 'received 0 damage' });
      });
    });
  });

  describe('attack', () => {
    describe('onlyReact', () => {
      describe('when false', () => {
        it('return attack with skill value 25 and damage 1', () => {
          expect(state().attack(consumeAction)).toEqual(expected);
        });
      });

      describe('when true', () => {
        describe('when not attacked', () => {
          it('should not attack', () => {
            expect(state(true).attack(consumeAction)).toEqual(null);
          });
        });

        describe('when attacked', () => {
          it('should attack', () => {
            expect(state(true).attack(attackAction)).toEqual(expected);
          });
        });
      });
    });
  });
});

const attackAction = createActionableDefinition('ATTACK', 'attack', 'Attack');

const consumeAction = createActionableDefinition(
  'CONSUME',
  'consume',
  'Consume'
);

const damage = new DamageDefinition(createDice(), 1);

const expected = {
  skillValue: 25,
  damage,
};

const f = () => emptyState;

const lazy = new LazyHelper(f);

const state = (onlyReact: boolean = false) =>
  new EnemyState(
    new ArrayView([attackAction]),
    lazy,
    10,
    damage,
    25,
    onlyReact
  );

const state2 = () =>
  new EnemyState(new ArrayView([attackAction]), lazy, 4, damage, 25, false);
