import { instance } from 'ts-mockito';

import { RulesHub } from '@hubs/rules.hub';

import {
  mockedAffectRule,
  mockedConsumeRule,
  mockedInteractionRule,
  mockedEquipRule,
  mockedPickRule,
  mockedSceneRule,
  mockedSkillRule,
  mockedUnEquipRule,
  mockedAccessoryRule,
  mockedReadRule,
} from '../../../tests/mocks';

describe('RulesHub', () => {
  const service = new RulesHub(
    instance(mockedSkillRule),
    instance(mockedPickRule),
    instance(mockedEquipRule),
    instance(mockedUnEquipRule),
    instance(mockedSceneRule),
    instance(mockedAffectRule),
    instance(mockedConsumeRule),
    instance(mockedInteractionRule),
    instance(mockedAccessoryRule),
    instance(mockedReadRule)
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
