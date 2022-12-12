import { ActionableDefinition } from '../definitions/actionable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
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
      ).toThrowError(errorMessages['WRONG-ACTION']);
    });
  });
});
