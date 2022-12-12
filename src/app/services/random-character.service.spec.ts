import { TestBed } from '@angular/core/testing';

import { anyNumber, anything, instance, when } from 'ts-mockito';

import { RandomCharacterService } from './random-character.service';
import { GeneratorService } from './generator.service';
import { PlayerEntity } from '../entities/player.entity';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { SkillService } from './skill.service';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';

import {
  mockedGeneratorService,
  mockedSkillService,
  setupMocks,
} from '../../../tests/mocks';
import { fakeCharacteristics, fakeIdentity } from '../../../tests/fakes';

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

    setupMocks();

    service = TestBed.inject(RandomCharacterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('character', () => {
    it('return new character', () => {
      const distributedSkills = new Map<SkillNameLiteral, number>([
        ['Firearm (Handgun)', 35],
        ['First Aid', 35],
        ['Manipulation', 35],
        ['Detect', 35],
        ['Research', 35],
        ['Drive (Automobile)', 35],
        ['Firearm (Shooter)', 35],
        ['Brawl', 35],
        ['Dodge', 35],
        ['Athleticism', 5],
        ['Appraise', 5],
        ['Bargain', 5],
        ['Disguise', 5],
        ['Streetwise', 5],
        ['Hide', 5],
        ['Melee Weapon (Simple)', 5],
        ['Ranged Weapon (Throw)', 5],
        ['Performance', 5],
        ['Sleight of Hand', 5],
        ['Survival', 5],
      ]);

      when(mockedSkillService.distribute(anything(), anyNumber()))
        .thenReturn(
          new Map([
            ['Firearm (Handgun)', 0],
            ['First Aid', 0],
            ['Manipulation', 0],
            ['Detect', 0],
            ['Research', 0],
            ['Drive (Automobile)', 0],
            ['Firearm (Shooter)', 0],
            ['Brawl', 0],
            ['Dodge', 0],
          ])
        )
        .thenReturn(distributedSkills);

      const expectedCharacter = new PlayerEntity(
        fakeIdentity,
        new ActorBehavior(fakeCharacteristics, distributedSkills),
        new EquipmentBehavior()
      );

      const character = service.character();

      expect(character).toEqual(expectedCharacter);
    });
  });
});
