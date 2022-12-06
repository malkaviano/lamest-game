import { first, take } from 'rxjs';
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

  when(mockedState1.attack).thenReturn(null);
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
      when(
        mockedState1.onResult(anything(), anyString(), anything())
      ).thenReturn({ state: state2 });

      const entity = fakeEntity();

      let result: ArrayView<ActionableDefinition> | undefined;

      entity.actionsChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      entity.reactTo(pick, 'NONE');

      done();

      expect(result).toEqual(new ArrayView([pick]));
    });
  });

  describe('when reset is invoked', () => {
    describe('when interactive is resettable', () => {
      it('push an actionsChanged notification with initial action', (done) => {
        when(
          mockedState1.onResult(anything(), anyString(), anything())
        ).thenReturn({ state: state2 });

        const entity = fakeEntity();

        let result: ArrayView<ActionableDefinition> | undefined;

        entity.actionsChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        entity.reactTo(pick, 'NONE');

        entity.reset();

        done();

        expect(result).toEqual(new ArrayView([action]));
      });
    });

    describe('when interactive is not resettable', () => {
      it('keep current state', (done) => {
        when(
          mockedState1.onResult(anything(), anyString(), anything())
        ).thenReturn({ state: state2 });

        const entity = fakeEntity(false);

        let result: ArrayView<ActionableDefinition> | undefined;

        entity.actionsChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        entity.reactTo(pick, 'NONE');

        entity.reset();

        done();

        expect(result).toEqual(new ArrayView([pick]));
      });
    });
  });
});

const pick = new ActionableDefinition('PICK', 'name1', 'label1');

const action = new ActionableDefinition('CONSUME', 'name1', 'label1');

const mockedState1 = mock<ActionableState>();

const mockedState2 = mock<ActionableState>();

const state1 = instance(mockedState1);

const state2 = instance(mockedState2);

const fakeEntity = (resettable = true, state: ActionableState = state1) =>
  new InteractiveEntity(
    'id1',
    'SomeEntity',
    'Testing Entity',
    state,
    resettable
  );
