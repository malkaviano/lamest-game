import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { ArrayView } from '../views/array.view';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { RandomIntService } from './random-int.service';
import { SkillService } from './skill.service';

import { mockedRandomIntService } from '../../../tests/mocks';

describe('SkillService', () => {
  let service: SkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RandomIntService,
          useValue: instance(mockedRandomIntService),
        },
      ],
    });
    service = TestBed.inject(SkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create new profession skill set', () => {
    const expectedNewSkillSet = new Map<SkillNameLiteral, number>([
      ['First Aid', 0],
      ['Research', 0],
    ]);

    const skillNames: ArrayView<SkillNameLiteral> = new ArrayView([
      'First Aid',
      'Research',
    ]);

    const result = service.newSkillSetFor(skillNames);

    expect(result).toEqual(expectedNewSkillSet);
  });

  it('should distribute 20 points over skills', () => {
    const expectedSkills = new Map<SkillNameLiteral, number>([
      ['First Aid', 10],
      ['Research', 5],
      ['Athleticism', 5],
    ]);

    const selectedSkills = new Map<SkillNameLiteral, number>([
      ['First Aid', 0],
      ['Research', 0],
      ['Athleticism', 0],
    ]);

    when(mockedRandomIntService.getRandomInterval(0, 1))
      .thenReturn(1)
      .thenReturn(0)
      .thenReturn(0)
      .thenReturn(1);

    const result = service.distribute(selectedSkills, 20);

    expect(result).toEqual(expectedSkills);
  });
});
