import { ActionableDefinition } from '../definitions/actionable.definition';
import { GameMessagesStore } from '../stores/game-messages.store';
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
      ).toThrowError(GameMessagesStore.errorMessages['WRONG-ACTION']);
    });
  });
});
