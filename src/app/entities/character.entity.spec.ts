import { take } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { IdentityDefinition } from '../definitions/identity.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacterEntity } from './character.entity';
import { HitPointsEvent } from '../events/hitpoints.event';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { ActorBehavior } from '../behaviors/actor.behavior';

describe('CharacterEntity', () => {
  describe('derivedAttributes', () => {
    it('return HP 9, PP 13, MOV 10', () => {
      when(mockedActorBehavior.derivedAttributes).thenReturn(
        expectedDerivedAttributes
      );

      expect(character().derivedAttributes).toEqual(expectedDerivedAttributes);
    });
  });

  describe('skill', () => {
    it('return Appraise 12 and Dodge 32', () => {
      when(mockedActorBehavior.skills).thenReturn(expectedSkills);

      expect(character().skills).toEqual(expectedSkills);
    });
  });

  describe('characteristics', () => {
    it('return characteristics', () => {
      when(mockedActorBehavior.characteristics).thenReturn(fakeCharacteristics);

      expect(character().characteristics).toEqual(fakeCharacteristics);
    });
  });

  describe('damaged', () => {
    it('should emit an event', (done) => {
      let result: HitPointsEvent | undefined;

      when(mockedActorBehavior.damaged(6)).thenReturn(new HitPointsEvent(9, 3));

      const char = character();

      char.hpChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      char.damaged(6);

      done();

      expect(result).toEqual(new HitPointsEvent(9, 3));
    });
  });

  describe('healed', () => {
    it('should emit an event', (done) => {
      let result: HitPointsEvent | undefined;

      when(mockedActorBehavior.damaged(3)).thenReturn(new HitPointsEvent(9, 6));

      when(mockedActorBehavior.healed(5)).thenReturn(new HitPointsEvent(6, 9));

      const char = character();

      char.hpChanged$.pipe(take(10)).subscribe((event) => {
        result = event;
      });

      char.damaged(3);

      char.healed(5);

      done();

      expect(result).toEqual(new HitPointsEvent(6, 9));
    });
  });
});

const fakeIdentity = new IdentityDefinition(
  'Some Name',
  'Police Detective',
  'YOUNG',
  'HUMAN',
  'SHORT',
  'LIGHT'
);

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

const mockedActorBehavior = mock(ActorBehavior);

const character = () =>
  new CharacterEntity(fakeIdentity, instance(mockedActorBehavior));

const expectedSkills = {
  Appraise: 12,
  Dodge: 32,
};
