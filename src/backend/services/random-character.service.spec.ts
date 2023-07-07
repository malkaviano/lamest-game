import { anyNumber, anything, instance, when } from 'ts-mockito';

import { RandomCharacterService } from './random-character.service';
import { ArrayView } from '../../core/view-models/array.view';
import { PlayerEntity } from '../../core/entities/player.entity';
import { ActorBehavior } from '../../core/behaviors/actor.behavior';
import { EquipmentBehavior } from '../../core/behaviors/equipment.behavior';
import { CooldownBehavior } from '../../core/behaviors/cooldown.behavior';

import {
  mockedGeneratorService,
  mockedProfessionStore,
  mockedSettingsStore,
  mockedSkillService,
  mockedSkillStore,
  setupMocks,
} from '../../../tests/mocks';
import {
  actorSettings,
  fakeCharacteristics,
  fakeIdentity,
} from '../../../tests/fakes';

describe('RandomCharacterService', () => {
  let service: RandomCharacterService;

  beforeEach(() => {
    setupMocks();

    when(mockedProfessionStore.professions).thenReturn({
      'Police Detective': ArrayView.create(),
    });

    when(mockedSkillStore.naturalSkills).thenReturn(
      ArrayView.create('Artillery', 'First Aid', 'Manipulation')
    );

    service = new RandomCharacterService(
      instance(mockedGeneratorService),
      instance(mockedSkillService),
      instance(mockedProfessionStore),
      instance(mockedSkillStore),
      instance(mockedSettingsStore)
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

      expect(character).toEqual(expectedCharacter);
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

const expectedCharacter = new PlayerEntity(
  fakeIdentity,
  ActorBehavior.create(
    fakeCharacteristics,
    distributedSkills,
    instance(mockedSkillStore),
    actorSettings
  ),
  EquipmentBehavior.create(),
  CooldownBehavior.create(0)
);
