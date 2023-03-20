import { ActionableDefinition } from '../definitions/actionable.definition';
import { GameStringsStore } from '../stores/game-strings.store';
import { emptyState } from './empty.state';

describe('EmptyState', () => {
  describe('when invoking stateResult', () => {
    it('throws', () => {
      expect(() =>
        emptyState.onResult(
          new ActionableDefinition('INTERACTION', 'gg', 'GG'),
          'NONE',
          {}
        )
      ).toThrowError(GameStringsStore.errorMessages['WRONG-ACTION']);
    });
  });
});
