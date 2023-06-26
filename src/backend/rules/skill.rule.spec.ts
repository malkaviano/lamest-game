import { instance, when } from 'ts-mockito';

import { SkillRule } from './skill.rule';
import { RollDefinition } from '../../core/definitions/roll.definition';

import {
  mockedPlayerEntity,
  mockedInteractiveEntity,
  mockedRollHelper,
  setupMocks,
  mockedCheckedService,
  mockedAffectedAxiom,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionSkillSurvival,
  interactiveInfo,
} from '../../../tests/fakes';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

describe('SkillRule', () => {
  const rule = new SkillRule(
    instance(mockedRollHelper),
    instance(mockedCheckedService),
    instance(mockedAffectedAxiom)
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

      const spy = spyOn(instance(mockedAffectedAxiom), 'affectWith');

      rule.execute(actor, eventSkillSurvival, extras);

      expect(spy).toHaveBeenCalled();
    });

    it('return rule result', () => {
      const rollResult = new RollDefinition('SUCCESS', 10);
      when(
        mockedRollHelper.actorSkillCheck(
          actor,
          eventSkillSurvival.actionableDefinition.name
        )
      ).thenReturn(new RollDefinition('SUCCESS', 10));

      const expected: RuleResultInterface = {
        event: eventSkillSurvival,
        actor,
        target,
        result: rollResult.result,
        skill: {
          roll: rollResult.roll,
          name: eventSkillSurvival.actionableDefinition.name,
        },
      };

      const result = rule.execute(actor, eventSkillSurvival, extras);

      expect(result).toEqual(expected);
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
