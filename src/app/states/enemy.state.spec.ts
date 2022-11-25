import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
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

  describe('attack', () => {
    it('return attack with skill value 25 and damage 1', () => {
      expect(state().attack).toEqual(expected);
    });
  });
});

const attackAction = createActionableDefinition('ATTACK', 'attack', 'Attack');

const damage = new DamageDefinition(createDice(), 1);

const expected = {
  skillValue: 25,
  damage,
};

const state = () => new EnemyState([attackAction], emptyState, 10, damage, 25);

const state2 = () => new EnemyState([attackAction], emptyState, 4, damage, 25);
