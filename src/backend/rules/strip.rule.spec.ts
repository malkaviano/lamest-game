import { instance, verify, when } from 'ts-mockito';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActionableEvent } from '@events/actionable.event';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { stripActionable } from '@definitions/actionable.definition';
import { StripRule } from '@rules/strip.rule';

import {
  mockedPlayerEntity,
  mockedInventoryService,
  setupMocks,
} from '../../../tests/mocks';
import { kevlarVest, leatherJacket, playerInfo } from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('StripRule', () => {
  let rule: StripRule;

  const actor = instance(mockedPlayerEntity);

  beforeEach(() => {
    setupMocks();

    rule = new StripRule(instance(mockedInventoryService));

    when(mockedPlayerEntity.strip()).thenReturn(kevlarVest);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('when wearing armor', () => {
    it('should log armor strip', (done) => {
      ruleScenario(rule, actor, stripEvent, {}, [stripLog], done);
    });

    it('return strip result', () => {
      const result = rule.execute(actor, stripEvent);

      verify(mockedInventoryService.store(actor.id, kevlarVest)).once();

      const expected: RuleResultInterface = {
        name: 'STRIP',
        event: stripEvent,
        result: 'EXECUTED',
        actor,
        strip: kevlarVest,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('when wearing no armor', () => {
    it('return denied result', () => {
      when(mockedPlayerEntity.strip()).thenReturn(null);

      const result = rule.execute(actor, stripEvent);

      const expected: RuleResultInterface = {
        name: 'STRIP',
        event: stripEvent,
        result: 'DENIED',
        actor,
      };

      expect(result).toEqual(expected);
    });
  });
});

const stripLog = new LogMessageDefinition(
  'STRIP',
  playerInfo.name,
  'strip Kevlar Vest'
);

const stripEvent = new ActionableEvent(
  stripActionable,
  leatherJacket.identity.name
);
