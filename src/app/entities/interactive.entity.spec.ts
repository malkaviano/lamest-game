import { first, last, take } from 'rxjs';
import { anyString, anything, instance, mock, reset, when } from 'ts-mockito';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { ActionableState } from '../states/actionable.state';
import { InteractiveEntity } from './interactive.entity';

beforeEach(() => {
  reset(mockedState1);

  reset(mockedState2);

  when(mockedState1.actions).thenReturn(new ArrayView([action]));

  when(mockedState2.actions).thenReturn(new ArrayView([pick]));
});

describe('InteractiveEntity', () => {
  describe('initial state', () => {
    it('push an actionsChanged notification', (done) => {
      const expected = new ArrayView([action]);

      const entity = fakeEntity();

      entity.actionsChanged$.pipe(first()).subscribe((event) => {
        expect(event).toEqual(expected);
      });

      done();
    });
  });

  describe('when interactive state changes', () => {
    it('push an actionsChanged notification', (done) => {
      when(mockedState1.onResult(anything(), anyString())).thenReturn(state2);

      const entity = fakeEntity();

      entity.actionsChanged$
        .pipe(take(2))
        .pipe(last())
        .subscribe((event) => {
          expect(event).toEqual(new ArrayView([pick]));
        });

      entity.actionSelected(pick, 'NONE');

      done();
    });
  });

  describe('when reset is invoked', () => {
    it('push an actionsChanged notification with initial action', (done) => {
      when(mockedState1.onResult(anything(), anyString())).thenReturn(state2);

      const entity = fakeEntity();

      entity.actionsChanged$.pipe(take(3), last()).subscribe((event) => {
        expect(event).toEqual(new ArrayView([action]));
      });

      entity.actionSelected(pick, 'NONE');

      entity.reset();

      done();
    });
  });
});

const pick = new ActionableDefinition('PICK', 'name1', 'label1');

const action = new ActionableDefinition('OPEN', 'name1', 'label1');

const mockedState1 = mock<ActionableState>();

const mockedState2 = mock<ActionableState>();

const state1 = instance(mockedState1);

const state2 = instance(mockedState2);

const fakeEntity = () =>
  new InteractiveEntity('id1', 'SomeEntity', 'Testing Entity', state1);
