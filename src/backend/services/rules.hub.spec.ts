import { instance } from 'ts-mockito';

import { RulesHub } from './rules.hub';

import {
  mockedCombatRule,
  mockedConsumeRule,
  mockedInteractionRule,
  mockedEquipRule,
  mockedPickRule,
  mockedSceneRule,
  mockedSkillRule,
  mockedUnEquipRule,
  mockedUseRule,
  mockedInspectRule,
} from '../../../tests/mocks';

describe('RulesHub', () => {
  const service = new RulesHub(
    instance(mockedSkillRule),
    instance(mockedPickRule),
    instance(mockedEquipRule),
    instance(mockedUnEquipRule),
    instance(mockedSceneRule),
    instance(mockedCombatRule),
    instance(mockedConsumeRule),
    instance(mockedInteractionRule),
    instance(mockedUseRule),
    instance(mockedInspectRule)
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
