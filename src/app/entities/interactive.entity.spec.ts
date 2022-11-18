import { first, last, take } from 'rxjs';
import { anything, instance, mock, reset, when } from 'ts-mockito';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { ActionLogDefinition } from '../definitions/action-log.definition';
import { ActionableState } from '../states/actionable.state';
import { InteractiveEntity } from './interactive.entity';
import { StateResult } from '../results/state.result';
import { InteractiveLogDefinition } from '../definitions/interactive-log.definition';

beforeEach(() => {
  reset(mockedState);
});

describe('InteractiveEntity', () => {
  describe('initial state', () => {
    it('push an actionsChanged notification', (done) => {
      const action = new ActionableDefinition('OPEN', 'name1', 'label1', 'id1');

      const expected = new ArrayView([action]);

      const log = new ActionLogDefinition(action.label, 'gg');

      when(mockedState.actions).thenReturn(expected);

      when(mockedState.execute(anything())).thenReturn(
        new StateResult(state, log)
      );

      const entity = fakeEntity();

      entity.actionsChanged$.pipe(first()).subscribe((event) => {
        expect(event).toEqual(expected);
      });

      done();
    });
  });

  describe('when interactive state changes', () => {
    it('push an actionsChanged notification', (done) => {
      const pick = new ActionableDefinition('PICK', 'name1', 'label1', 'id1');

      const action = new ActionableDefinition('OPEN', 'name1', 'label1', 'id1');

      const log = new ActionLogDefinition(action.label, 'gg');

      when(mockedState.actions)
        .thenReturn(new ArrayView([action]))
        .thenReturn(new ArrayView([action]))
        .thenReturn(new ArrayView([pick]));

      when(mockedState.execute(anything())).thenReturn(
        new StateResult(state, log)
      );

      const entity = fakeEntity();

      entity.actionsChanged$.pipe(take(2), last()).subscribe((event) => {
        expect(event).toEqual(new ArrayView([pick]));
      });

      entity.onActionSelected(pick);

      done();
    });
  });

  describe('when actionable was executed', () => {
    it('push an actionResult notification', (done) => {
      const action = new ActionableDefinition('OPEN', 'name1', 'label1', 'id1');

      const log = new ActionLogDefinition(action.label, 'gg');

      const expected = new InteractiveLogDefinition('SomeEntity', log);

      when(mockedState.execute(anything())).thenReturn({ state, log });

      when(mockedState.actions).thenReturn(new ArrayView([action]));

      const entity = fakeEntity();

      entity.actionResult$.pipe(first()).subscribe((event) => {
        expect(event).toEqual(expected);
      });

      entity.onActionSelected(action);

      done();
    });

    it('push an actionSelected notification', (done) => {
      const action = new ActionableDefinition('OPEN', 'name1', 'label1', 'id1');

      const expected = new ArrayView([action]);

      const log = new ActionLogDefinition(action.label, 'gg');

      when(mockedState.execute(anything())).thenReturn({ state, log });

      when(mockedState.actions).thenReturn(expected);

      const entity = fakeEntity();

      entity.actionSelected$.pipe(first()).subscribe((event) => {
        expect(event).toEqual(action);
      });

      entity.onActionSelected(action);

      done();
    });
  });
});

const mockedState = mock<ActionableState>();

const state = instance(mockedState);

const fakeEntity = () =>
  new InteractiveEntity('id1', 'SomeEntity', 'Testing Entity', state);
