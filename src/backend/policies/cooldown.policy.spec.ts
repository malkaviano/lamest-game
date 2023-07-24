import { instance, when } from 'ts-mockito';

import { CheckResultLiteral } from '@literals/check-result.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { CooldownPolicy } from '@policies/cooldown.policy';
import { affectActionable } from '@definitions/actionable.definition';
import { SkillDefinition } from '@definitions/skill.definition';
import { LogMessageDefinition } from '@definitions/log-message.definition';

import {
  mockedPlayerEntity,
  mockedSkillStore,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionDetect,
  actionHide,
  actionableEvent,
} from '../../../tests/fakes';
import { testPolicy } from '../../../tests/scenarios';

const actor = instance(mockedPlayerEntity);

const target = instance(mockedPlayerEntity);

const eventDetect = actionableEvent(actionDetect, target.id);

const eventAffect = actionableEvent(affectActionable, target.id);

const eventHide = actionableEvent(actionHide, actor.id);

describe('CooldownPolicy', () => {
  const policy = new CooldownPolicy(instance(mockedSkillStore));

  beforeEach(() => {
    setupMocks();

    when(mockedSkillStore.skills).thenReturn({
      Detect: new SkillDefinition('detect', 'Detect', 'NATURAL', false, [
        'INT',
      ]),
      Hide: new SkillDefinition('hide', 'Hide', 'NATURAL', false, ['INT']),
      'Melee Weapon (Simple)': new SkillDefinition(
        'Melee Weapon (Simple)',
        'Melee Weapon (Simple)',
        'NATURAL',
        true,
        ['INT']
      ),
    });
  });

  it('should create an instance', () => {
    expect(policy).toBeTruthy();
  });

  describe('enforce', () => {
    describe('when using a skill', () => {
      [
        {
          ruleResult: {
            name: 'SKILL' as RuleNameLiteral,
            actor,
            event: eventDetect,
            target,
            result: 'EXECUTED' as RuleResultLiteral,
            roll: { checkRoll: 2, result: 'SUCCESS' as CheckResultLiteral },
            skillName: 'Detect',
          },
          expected: {
            cooldown: {
              name: 'Detect',
              duration: 120,
              target: false,
            },
          },
          logs: [
            new LogMessageDefinition(
              'COOLDOWN',
              'Some Name',
              'skill Detect is on cooldown for 1 seconds'
            ),
          ],
        },
        {
          ruleResult: {
            name: 'SKILL' as RuleNameLiteral,
            actor,
            event: eventHide,
            target,
            result: 'DENIED' as RuleResultLiteral,
            skillName: 'Hide',
          },
          expected: {},
          logs: [],
        },
        {
          ruleResult: {
            name: 'AFFECT' as RuleNameLiteral,
            actor,
            event: eventAffect,
            target,
            result: 'EXECUTED' as RuleResultLiteral,
            roll: { checkRoll: 2, result: 'SUCCESS' as CheckResultLiteral },
            skillName: 'Melee Weapon (Simple)',
          },
          expected: {
            cooldown: {
              name: 'ENGAGEMENT',
              duration: 30,
              target: true,
            },
          },
          logs: [
            new LogMessageDefinition(
              'COOLDOWN',
              'Some Name',
              'has engaged another actor and is on engagement timer for 1 seconds'
            ),
            new LogMessageDefinition(
              'COOLDOWN',
              'Some Name',
              'has engaged another actor and is on engagement timer for 1 seconds'
            ),
          ],
        },
      ].forEach(({ ruleResult, expected, logs }) => {
        testPolicy(policy, ruleResult, expected, logs);
      });
    });
  });
});
