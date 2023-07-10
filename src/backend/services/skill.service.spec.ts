import { instance, when } from 'ts-mockito';

import { SkillService } from '@services/skill.service';
import { ArrayView } from '@wrappers/array.view';

import { mockedRandomIntHelper, setupMocks } from '../../../tests/mocks';

describe('SkillService', () => {
  let service: SkillService;

  beforeEach(() => {
    setupMocks();

    service = new SkillService(instance(mockedRandomIntHelper));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create new profession skill set', () => {
    const expectedNewSkillSet = new Map<string, number>([
      ['First Aid', 0],
      ['Research', 0],
    ]);

    const skillNames: ArrayView<string> = ArrayView.create(
      'First Aid',
      'Research'
    );

    const result = service.newSkillSetFor(skillNames);

    expect(result).toEqual(expectedNewSkillSet);
  });

  it('should distribute 20 points over skills', () => {
    const expectedSkills = new Map<string, number>([
      ['First Aid', 10],
      ['Research', 5],
      ['Athleticism', 5],
    ]);

    const selectedSkills = new Map<string, number>([
      ['First Aid', 0],
      ['Research', 0],
      ['Athleticism', 0],
    ]);

    when(mockedRandomIntHelper.getRandomInterval(0, 1))
      .thenReturn(1)
      .thenReturn(0)
      .thenReturn(0)
      .thenReturn(1);

    const result = service.distribute(selectedSkills, 20);

    expect(result).toEqual(expectedSkills);
  });
});
