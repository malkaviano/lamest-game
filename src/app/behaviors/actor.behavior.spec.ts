import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { DerivedAttributeDefinition } from '../definitions/derived-attribute.definition';
import { HitPointsEvent } from '../events/hitpoints.event';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ActorBehavior } from './actor.behavior';

describe('ActorBehavior', () => {
  describe('characteristics', () => {
    it('return characteristics', () => {
      expect(behavior().characteristics).toEqual(expectedCharacteristics);
    });
  });

  describe('derived attributes', () => {
    it('return derived attributes', () => {
      expect(behavior().derivedAttributes).toEqual(expectedDerivedAttributes);
    });
  });

  describe('skills', () => {
    it('return skills with characteristics applied', () => {
      expect(behavior().skills).toEqual({
        Appraise: 12,
        Dodge: 32,
      });
    });
  });

  describe('damaged', () => {
    it('return HitPointsEvent previous 9 current 0', () => {
      const result = behavior().damaged(12);

      expect(result).toEqual(new HitPointsEvent(9, 0));
    });
  });

  describe('healed', () => {
    it('return HitPointsEvent previous 9 current 0', () => {
      const char = behavior();

      char.damaged(2);

      const result = char.healed(4);

      expect(result).toEqual(new HitPointsEvent(7, 9));
    });
  });
});

const expectedCharacteristics: CharacteristicSetDefinition = {
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

const expectedSkills = new Map<SkillNameLiteral, number>([
  ['Appraise', 0],
  ['Dodge', 10],
]);

const behavior = () =>
  new ActorBehavior(expectedCharacteristics, expectedSkills);
