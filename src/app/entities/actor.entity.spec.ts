import { instance, mock, when } from 'ts-mockito';
import { ActionableDefinition } from '../definitions/actionable.definition';

import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ActionableState } from '../states/actionable.state';
import { ArrayView } from '../views/array.view';
import { ActorEntity } from './actor.entity';

beforeEach(() => {
  when(mockedState3.actions).thenReturn(new ArrayView([action, pick]));
});

describe('ActorEntity', () => {
  describe('damagePlayer', () => {
    describe('when state do not produce damage', () => {
      it('return null', () => {
        when(mockedState3.attack).thenReturn(null);

        const result = fakeEntity().attack;

        expect(result).toBeNull();
      });
    });

    describe('when state produces damage', () => {
      it('return DamageDefinition', () => {
        when(mockedState3.attack).thenReturn({
          skillValue: 15,
          weapon,
        });

        const result = fakeEntity(false).attack;

        expect(result).toEqual({
          skillValue: 15,
          weapon,
        });
      });
    });
  });
});

const mockedState3 = mock<ActionableState>();

const state3 = instance(mockedState3);

const damage = new DamageDefinition(createDice({}), 10);

const weapon = new WeaponDefinition(
  'gg',
  'claw',
  '',
  'Brawl',
  damage,
  true,
  'PERMANENT'
);

const fakeEntity = (resettable = true, state: ActionableState = state3) =>
  new ActorEntity('id1', 'SomeEntity', 'Testing Entity', state, resettable);

const pick = new ActionableDefinition('PICK', 'name1', 'label1');

const action = new ActionableDefinition('OPEN', 'name1', 'label1');
