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
  mockedGamePredicate,
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
      instance(mockedCheckedService),
      instance(mockedGamePredicate)
    );
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when rule is executed', () => {
      it('return success result', () => {
        when(
          mockedGamePredicate.canUseSkill(
            actor,
            eventSkillSurvival.actionableDefinition.name
          )
        ).thenReturn(true);

        const rollResult = new RollDefinition('SUCCESS', 10);

        when(
          mockedRollHelper.actorSkillCheck(
            actor,
            eventSkillSurvival.actionableDefinition.name
          )
        ).thenReturn(rollResult);

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

    describe('when rule is not executed', () => {
      it('return denied result', () => {
        when(
          mockedGamePredicate.canUseSkill(
            actor,
            eventSkillSurvival.actionableDefinition.name
          )
        ).thenReturn(false);

        const expected: RuleResultInterface = {
          name: 'SKILL',
          event: eventSkillSurvival,
          actor,
          target,
          result: 'DENIED',
          skillName: eventSkillSurvival.actionableDefinition.name,
        };

        const result = rule.execute(actor, eventSkillSurvival, extras);

        expect(result).toEqual(expected);
      });
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
