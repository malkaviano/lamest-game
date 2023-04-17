import { instance, when } from 'ts-mockito';

import { SkillRule } from './skill.rule';
import { RollDefinition } from '../../core/definitions/roll.definition';

import {
  mockedPlayerEntity,
  mockedInteractiveEntity,
  mockedRollHelper,
  setupMocks,
  mockedCheckedService,
  mockedAffectedAxiomService,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionSkillSurvival,
  interactiveInfo,
} from '../../../tests/fakes';

describe('SkillRule', () => {
  const rule = new SkillRule(
    instance(mockedRollHelper),
    instance(mockedCheckedService),
    instance(mockedAffectedAxiomService)
  );

  beforeEach(() => {
    setupMocks();
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    it('should log target log', () => {
      when(
        mockedRollHelper.actorSkillCheck(
          actor,
          eventSkillSurvival.actionableDefinition.name
        )
      ).thenReturn(new RollDefinition('SUCCESS', 10));

      const spy = spyOn(instance(mockedAffectedAxiomService), 'affectWith');

      rule.execute(actor, eventSkillSurvival, extras);

      expect(spy).toHaveBeenCalled();
    });
  });
});

const actor = instance(mockedPlayerEntity);

const target = instance(mockedInteractiveEntity);

const extras = {
  actorVisibility: actor,
  target,
};

const eventSkillSurvival = actionableEvent(
  actionSkillSurvival,
  interactiveInfo.id
);
