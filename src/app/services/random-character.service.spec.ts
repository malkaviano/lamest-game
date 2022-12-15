import { TestBed } from '@angular/core/testing';

import { anyNumber, anything, instance, when } from 'ts-mockito';

import { RandomCharacterService } from './random-character.service';
import { GeneratorService } from './generator.service';
import { PlayerEntity } from '../entities/player.entity';

import { SkillService } from './skill.service';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ProfessionStore } from '../stores/profession.store';
import { ArrayView } from '../views/array.view';

import {
  mockedGeneratorService,
  mockedProfessionStore,
  mockedSkillService,
  mockedSkillStore,
  setupMocks,
} from '../../../tests/mocks';
import { fakeCharacteristics, fakeIdentity } from '../../../tests/fakes';
import { SkillStore } from '../stores/skill.store';
import { EffectTypeLiteral } from '../literals/effect-type.literal';

describe('RandomCharacterService', () => {
  let service: RandomCharacterService;

  beforeEach(() => {
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
        {
          provide: ProfessionStore,
          useValue: instance(mockedProfessionStore),
        },
        {
          provide: SkillStore,
          useValue: instance(mockedSkillStore),
        },
      ],
    });

    setupMocks();

    when(mockedProfessionStore.professions).thenReturn({
      'Police Detective': ArrayView.create([]),
    });

    when(mockedSkillStore.naturalSkills).thenReturn(
      ArrayView.create(['Artillery', 'First Aid', 'Manipulation'])
    );

    service = TestBed.inject(RandomCharacterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('character', () => {
    it('return new character', () => {
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
        ActorBehavior.create(
          fakeCharacteristics,
          distributedSkills,
          instance(mockedSkillStore),
          {
            immunities: ArrayView.create<EffectTypeLiteral>([]),
            cures: ArrayView.create<EffectTypeLiteral>(['REMEDY', 'SACRED']),
            vulnerabilities: ArrayView.create<EffectTypeLiteral>([]),
            resistances: ArrayView.create<EffectTypeLiteral>([]),
          },
          {
            resistanceCoefficient: 0.5,
            vulnerabilityCoefficient: 1.5,
          }
        ),
        EquipmentBehavior.create()
      );

      const character = service.character();

      expect(character).toEqual(expectedCharacter);
    });
  });
});
