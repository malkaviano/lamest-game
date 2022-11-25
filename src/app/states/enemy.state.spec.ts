import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { ActionableEvent } from '../events/actionable.event';
import { emptyState } from './empty.state';
import { EnemyState } from './enemy.state';

describe('EnemyState', () => {
  describe('stateResult', () => {
    describe('when HP <= 0', () => {
      it('return empty state', () => {
        const result = state().onResult(attackAction, 'SUCCESS', 12);

        expect(result).toEqual(emptyState);
      });
    });

    describe('when HP > 0', () => {
      it('return EnemyState with remaining HP', () => {
        const result = state().onResult(attackAction, 'SUCCESS', 6);

        expect(result).toEqual(state2());
      });
    });

    describe('when no damage is taken', () => {
      it('return EnemyState with same HP', () => {
        const result = state().onResult(attackAction, 'SUCCESS');

        expect(result).toEqual(state());
      });
    });
  });

  describe('damage', () => {
    it('return damage with fixed value 1', () => {
      expect(state().damage(new ActionableEvent(attackAction, 'id1'))).toEqual(
        damage
      );
    });
  });
});

const attackAction = createActionableDefinition('ATTACK', 'attack', 'Attack');

const damage = new DamageDefinition(createDice(), 1);

const state = () => new EnemyState([attackAction], emptyState, 10, damage);

const state2 = () => new EnemyState([attackAction], emptyState, 4, damage);
