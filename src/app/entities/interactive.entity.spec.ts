import { first } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';
import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { ActionLogDefinition } from '../definitions/action-log.definition';

import { InteractiveState } from '../states/interactive.state';
import { InteractiveEntity } from './interactive.entity';

const mockedState = mock<InteractiveState>();

const state = instance(mockedState);

const entity = new InteractiveEntity(
  'id1',
  'SomeEntity',
  'Testing Entity',
  state
);

describe('InteractiveEntity', () => {
  describe('when interactive state changes', () => {
    it('push an event changed notification', (done) => {
      const action = new ActionableDefinition('OPEN', 'name1', 'label1', 'id1');

      const expected = new ArrayView([action]);

      const log = new ActionLogDefinition(action.label, 'gg');

      when(mockedState.execute(anything())).thenReturn({ state, log });

      when(mockedState.actions)
        .thenReturn(
          new ArrayView([
            new ActionableDefinition('PICK', 'name1', 'label1', 'id1'),
          ])
        )
        .thenReturn(expected);

      entity.onActionSelected(
        new ActionableDefinition('PICK', 'name1', 'label1', 'id1')
      );

      entity.actionsChanged$
        .pipe(first())
        .subscribe((event) => {
          expect(event).toEqual(expected);
        })
        .unsubscribe();

      done();
    });
  });
});
