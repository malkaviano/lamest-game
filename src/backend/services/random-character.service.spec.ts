import { anyNumber, anything, instance, when } from 'ts-mockito';

import { RandomCharacterService } from '@services/random-character.service';
import { ArrayView } from '@wrappers/array.view';

import {
  mockedGeneratorService,
  mockedProfessionStore,
  mockedSkillService,
  mockedSkillStore,
  setupMocks,
} from '../../../tests/mocks';

describe('RandomCharacterService', () => {
  let service: RandomCharacterService;

  beforeEach(() => {
    setupMocks();

    when(mockedProfessionStore.professions).thenReturn({
      'Police Detective': ArrayView.empty(),
    });

    when(mockedSkillStore.naturalSkills).thenReturn(
      ArrayView.create('Artillery', 'First Aid', 'Manipulation')
    );

    service = new RandomCharacterService(
      instance(mockedGeneratorService),
      instance(mockedSkillService),
      instance(mockedProfessionStore),
      instance(mockedSkillStore)
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('character', () => {
    it('return new character', () => {
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

      const character = service.character();

      expect(character).toBeDefined();
    });
  });
});

const distributedSkills = new Map<string, number>([
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
