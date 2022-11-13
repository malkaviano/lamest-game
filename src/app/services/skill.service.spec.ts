import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { ArrayView } from '../definitions/array-view.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { RandomIntService } from './random-int.service';
import { SkillService } from './skill.service';

const mockedRandomIntService = mock(RandomIntService);

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
    const skillNames: ArrayView<SkillNameLiteral> = new ArrayView([
      'First Aid',
      'Insight',
      'Research',
      'Listen',
    ]);

    const result = service.newSkillSetFor(skillNames);

    expect(result).toEqual(expectedNewSkillSet);
  });

  it('should distribute 20 points over skills', () => {
    const selectedSkills = {
      'First Aid': 0,
      Insight: 0,
      Research: 0,
      Listen: 0,
    };

    when(mockedRandomIntService.getRandomInterval(0, 1))
      .thenReturn(1)
      .thenReturn(0)
      .thenReturn(0)
      .thenReturn(1);

    const result = service.distribute(selectedSkills, 20);

    expect(result).toEqual(expectedSkills);
  });
});

const expectedSkills = {
  'First Aid': 10,
  Insight: 5,
  Research: 0,
  Listen: 5,
};

const expectedNewSkillSet = {
  'First Aid': 0,
  Insight: 0,
  Research: 0,
  Listen: 0,
};
