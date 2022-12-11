import { first, take } from 'rxjs';
import { anyString, anything, instance, when } from 'ts-mockito';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { ActionableState } from '../states/actionable.state';
import { InteractiveEntity } from './interactive.entity';

import { actionConsume, actionPickBubbleGum } from '../../../tests/fakes';
import {
  mockedActionableState,
  mockedActionableState2,
  setupMocks,
} from '../../../tests/mocks';

describe('InteractiveEntity', () => {
  beforeEach(() => {
    setupMocks();

    when(mockedActionableState.actions).thenReturn(
      new ArrayView([actionConsume])
    );

    when(mockedActionableState2.actions).thenReturn(
      new ArrayView([actionPickBubbleGum])
    );
  });

  describe('initial state', () => {
    it('push an actionsChanged notification', (done) => {
      const expected = new ArrayView([actionConsume]);

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
        mockedActionableState.onResult(anything(), anyString(), anything())
      ).thenReturn({ state: state2 });

      const entity = fakeEntity();

      let result: ArrayView<ActionableDefinition> | undefined;

      entity.actionsChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      entity.reactTo(actionPickBubbleGum, 'NONE');

      done();

      expect(result).toEqual(new ArrayView([actionPickBubbleGum]));
    });
  });

  describe('when reset is invoked', () => {
    describe('when interactive is resettable', () => {
      it('push an actionsChanged notification with initial action', (done) => {
        when(
          mockedActionableState.onResult(anything(), anyString(), anything())
        ).thenReturn({ state: state2 });

        const entity = fakeEntity();

        let result: ArrayView<ActionableDefinition> | undefined;

        entity.actionsChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        entity.reactTo(actionPickBubbleGum, 'NONE');

        entity.reset();

        done();

        expect(result).toEqual(new ArrayView([actionConsume]));
      });
    });

    describe('when interactive is not resettable', () => {
      it('keep current state', (done) => {
        when(
          mockedActionableState.onResult(anything(), anyString(), anything())
        ).thenReturn({ state: state2 });

        const entity = fakeEntity(false);

        let result: ArrayView<ActionableDefinition> | undefined;

        entity.actionsChanged$.pipe(take(10)).subscribe((event) => {
          result = event;
        });

        entity.reactTo(actionPickBubbleGum, 'NONE');

        entity.reset();

        done();

        expect(result).toEqual(new ArrayView([actionPickBubbleGum]));
      });
    });
  });

  describe('classification', () => {
    it('return REACTIVE', () => {
      expect(fakeEntity().classification).toEqual('REACTIVE');
    });
  });
});

const state1 = instance(mockedActionableState);

const state2 = instance(mockedActionableState2);

const fakeEntity = (resettable = true, state: ActionableState = state1) =>
  new InteractiveEntity(
    'id1',
    'SomeEntity',
    'Testing Entity',
    state,
    resettable
  );
