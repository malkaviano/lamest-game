import { instance, when } from 'ts-mockito';

import { SkillRule } from '@rules/skill.rule';
import { RollDefinition } from '@definitions/roll.definition';
import { RuleResultInterface } from '@interfaces/rule-result.interface';

import {
  mockedPlayerEntity,
  mockedInteractiveEntity,
  mockedRollHelper,
  setupMocks,
  mockedCheckedService,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionSkillSurvival,
  interactiveInfo,
} from '../../../tests/fakes';

describe('SkillRule', () => {
  let rule: SkillRule;

  beforeEach(() => {
    setupMocks();

    rule = new SkillRule(
      instance(mockedRollHelper),
      instance(mockedCheckedService)
    );
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    it('return rule result', () => {
      const rollResult = new RollDefinition('SUCCESS', 10);
      when(
        mockedRollHelper.actorSkillCheck(
          actor,
          eventSkillSurvival.actionableDefinition.name
        )
      ).thenReturn(new RollDefinition('SUCCESS', 10));

      const expected: RuleResultInterface = {
        name: 'SKILL',
        event: eventSkillSurvival,
        actor,
        target,
        result: 'EXECUTED',
        skillName: eventSkillSurvival.actionableDefinition.name,
        roll: {
          checkRoll: rollResult.roll,
          result: 'SUCCESS',
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
