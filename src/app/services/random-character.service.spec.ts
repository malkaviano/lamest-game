import { TestBed } from '@angular/core/testing';

import { anyNumber, anything, instance, mock, when } from 'ts-mockito';

import { RandomCharacterService } from './random-character.service';
import { GeneratorService } from './generator.service';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { PlayerEntity } from '../entities/player.entity';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { SkillService } from './skill.service';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';

const mockedGeneratorService = mock(GeneratorService);
const mockedSkillService = mock(SkillService);

describe('RandomCharacterService', () => {
  let service: RandomCharacterService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GeneratorService,
          useValue: instance(mockedGeneratorService),
        },
        {
          provide: SkillService,
          useValue: instance(mockedSkillService),
        },
      ],
    });

    service = TestBed.inject(RandomCharacterService);

    prepareMock();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('character', () => {
    it('return new character', () => {
      const character = service.character();

      expect(character).toEqual(expectedCharacter);
    });
  });
});

const prepareMock = () => {
  when(mockedGeneratorService.identity()).thenReturn(fakeIdentity);

  when(mockedGeneratorService.characteristics()).thenReturn(
    fakeCharacteristics
  );

  when(mockedSkillService.distribute(anything(), anyNumber()))
    .thenReturn(
      new Map([
        ['Firearm (Handgun)', 0],
        ['First Aid', 0],
        ['Listen', 0],
        ['Persuade', 0],
        ['Spot', 0],
        ['Research', 0],
        ['Drive (Automobile)', 0],
        ['Firearm (Shooter)', 0],
        ['Brawl', 0],
        ['Dodge', 0],
      ])
    )
    .thenReturn(fakeSkills);
};

const fakeIdentity = new CharacterIdentityDefinition(
  'Some Name',
  'Police Detective',
  'YOUNG',
  'HUMAN',
  'SHORT',
  'LIGHT'
);

const fakeCharacteristics = {
  STR: new CharacteristicDefinition('STR', 8),
  VIT: new CharacteristicDefinition('VIT', 9),
  AGI: new CharacteristicDefinition('AGI', 11),
  INT: new CharacteristicDefinition('INT', 12),
  POW: new CharacteristicDefinition('POW', 13),
  APP: new CharacteristicDefinition('APP', 14),
};

const fakeSkills = new Map<SkillNameLiteral, number>([
  ['Firearm (Handgun)', 35],
  ['First Aid', 35],
  ['Listen', 35],
  ['Persuade', 35],
  ['Spot', 35],
  ['Research', 35],
  ['Drive (Automobile)', 35],
  ['Firearm (Shooter)', 35],
  ['Brawl', 35],
  ['Dodge', 35],
  ['Athleticism', 5],
  ['Appraise', 5],
  ['Bargain', 5],
  ['Disguise', 5],
  ['Gaming', 5],
  ['Hide', 5],
  ['Insight', 5],
  ['Melee Weapon (Simple)', 5],
  ['Ranged Weapon (Throw)', 5],
  ['Navigate', 5],
  ['Performance', 5],
  ['Sleight of Hand', 5],
  ['Survival', 5],
]);

const expectedCharacter = new PlayerEntity(
  fakeIdentity,
  new ActorBehavior(fakeCharacteristics, fakeSkills),
  new EquipmentBehavior()
);
