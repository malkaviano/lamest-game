import { anything, instance, mock, when } from 'ts-mockito';

import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ActionableDefinition } from '../definitions/actionable.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { createDice } from '../definitions/dice.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { ActionableState } from '../states/actionable.state';
import { ArrayView } from '../views/array.view';
import { ActorEntity } from './actor.entity';

beforeEach(() => {
  when(mockedState.actions).thenReturn(new ArrayView([action, attack]));

  when(mockedActorBehavior.damaged(4)).thenReturn(new HitPointsEvent(9, 5));

  when(mockedActorBehavior.healed(4)).thenReturn(new HitPointsEvent(9, 9));

  when(mockedActorBehavior.damaged(20)).thenReturn(new HitPointsEvent(9, 0));

  when(mockedState.onResult(anything(), anything(), anything())).thenReturn({
    state: someState,
    log: 'it passed thru',
  });
});

describe('ActorEntity', () => {
  describe('attack', () => {
    describe('when state do not produce damage', () => {
      it('return null', () => {
        when(mockedState.attack).thenReturn(null);

        const result = fakeEntity().attack;

        expect(result).toBeNull();
      });
    });

    describe('when state produces damage', () => {
      it('return DamageDefinition', () => {
        when(mockedState.attack).thenReturn({
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

  describe('derivedAttributes', () => {
    it('return HP 9, PP 13, MOV 10', () => {
      when(mockedActorBehavior.derivedAttributes).thenReturn(
        expectedDerivedAttributes
      );

      expect(fakeEntity().derivedAttributes).toEqual(expectedDerivedAttributes);
    });
  });

  describe('skill', () => {
    it('return Appraise 12 and Dodge 32', () => {
      when(mockedActorBehavior.skills).thenReturn(expectedSkills);

      expect(fakeEntity().skills).toEqual(expectedSkills);
    });
  });

  describe('characteristics', () => {
    it('return characteristics', () => {
      when(mockedActorBehavior.characteristics).thenReturn(fakeCharacteristics);

      expect(fakeEntity().characteristics).toEqual(fakeCharacteristics);
    });
  });
});

const mockedState = mock<ActionableState>();

const someState = instance(mockedState);

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

const mockedActorBehavior = mock(ActorBehavior);

const mockedEquipmentBehavior = mock(EquipmentBehavior);

const fakeEntity = (resettable = false, state: ActionableState = someState) =>
  new ActorEntity(
    'id1',
    'SomeEntity',
    'Testing Entity',
    state,
    resettable,
    instance(mockedActorBehavior),
    instance(mockedEquipmentBehavior)
  );

const attack = new ActionableDefinition('ATTACK', 'attack', 'Attack');

const action = new ActionableDefinition('CONSUME', 'name1', 'label1');

const fakeCharacteristics = {
  STR: new CharacteristicDefinition('STR', 8),
  CON: new CharacteristicDefinition('CON', 9),
  SIZ: new CharacteristicDefinition('SIZ', 10),
  DEX: new CharacteristicDefinition('DEX', 11),
  INT: new CharacteristicDefinition('INT', 12),
  POW: new CharacteristicDefinition('POW', 13),
  APP: new CharacteristicDefinition('APP', 14),
};

const expectedDerivedAttributes: DerivedAttributeSetDefinition = {
  HP: new DerivedAttributeDefinition('HP', 9),
  PP: new DerivedAttributeDefinition('PP', 13),
  MOV: new DerivedAttributeDefinition('MOV', 10),
};

const expectedSkills = {
  Appraise: 12,
  Dodge: 32,
};
