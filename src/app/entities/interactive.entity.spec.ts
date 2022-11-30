import { first, take } from 'rxjs';
import { anyString, anything, instance, mock, reset, when } from 'ts-mockito';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ArrayView } from '../views/array.view';
import { ActionableState } from '../states/actionable.state';
import { InteractiveEntity } from './interactive.entity';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';

beforeEach(() => {
  reset(mockedState1);

  reset(mockedState2);

  when(mockedState1.actions).thenReturn(new ArrayView([action]));

  when(mockedState2.actions).thenReturn(new ArrayView([pick]));

  when(mockedState3.actions).thenReturn(new ArrayView([action, pick]));

  when(mockedState1.attack).thenReturn(null);

  when(mockedState3.attack).thenReturn({
    skillValue: 15,
    damage,
    dodgeable: true,
    weaponName: 'claw',
  });
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

      entity.actionSelected(pick, 'NONE');

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

        entity.actionSelected(pick, 'NONE');

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

        entity.actionSelected(pick, 'NONE');

        entity.reset();

        done();

        expect(result).toEqual(new ArrayView([pick]));
      });
    });
  });

  describe('damagePlayer', () => {
    describe('when state do not produce damage', () => {
      it('return null', () => {
        const result = fakeEntity().attack;

        expect(result).toBeNull();
      });
    });

    describe('when state produces damage', () => {
      it('return DamageDefinition', () => {
        const result = fakeEntity(false, state3).attack;

        expect(result).toEqual({
          skillValue: 15,
          damage,
          dodgeable: true,
          weaponName: 'claw',
        });
      });
    });
  });
});

const pick = new ActionableDefinition('PICK', 'name1', 'label1');

const action = new ActionableDefinition('OPEN', 'name1', 'label1');

const mockedState1 = mock<ActionableState>();

const mockedState2 = mock<ActionableState>();

const mockedState3 = mock<ActionableState>();

const state1 = instance(mockedState1);

const state2 = instance(mockedState2);

const state3 = instance(mockedState3);

const fakeEntity = (resettable = true, state: ActionableState = state1) =>
  new InteractiveEntity(
    'id1',
    'SomeEntity',
    'Testing Entity',
    state,
    resettable
  );

const damage = new DamageDefinition(createDice({}), 10);
