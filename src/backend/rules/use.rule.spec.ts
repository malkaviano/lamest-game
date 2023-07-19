import { instance, when } from 'ts-mockito';

import { UseRule } from '@rules/use.rule';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { RuleResult } from '@results/rule.result';
import { UsableDefinition } from '@definitions/usable.definition';

import {
  mockedCheckedService,
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  playerInfo,
  interactiveInfo,
  actionUseDiscardKey,
  discardKey,
  actionableEvent,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('UseRule', () => {
  let rule: UseRule;

  beforeEach(() => {
    setupMocks();

    rule = new UseRule(
      instance(mockedInventoryService),
      instance(mockedCheckedService)
    );

    when(
      mockedCheckedService.takeItemOrThrow<UsableDefinition>(
        instance(mockedInventoryService),
        actor.id,
        discardKey.identity.name
      )
    ).thenReturn(discardKey);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item could not be found', () => {
      it('should log item not found', (done) => {
        ruleScenario(
          rule,
          actor,
          eventUseMasterKey,
          extras,
          [notFoundLog],
          done
        );
      });

      it('return denied result', () => {
        const result = rule.execute(actor, eventUseMasterKey, extras);

        const expected: RuleResult = {
          name: 'USE',
          event: eventUseMasterKey,
          result: 'DENIED',
          actor,
          target: extras.target,
        };

        expect(result).toEqual(expected);
      });
    });

    describe('when item was found', () => {
      it('return used result', () => {
        when(
          mockedInventoryService.look(playerInfo.id, discardKey.identity.name)
        ).thenReturn(discardKey);

        const result = rule.execute(actor, eventUseMasterKey, extras);

        const expected: RuleResult = {
          name: 'USE',
          event: eventUseMasterKey,
          result: 'EXECUTED',
          actor,
          target: extras.target,
          used: discardKey,
        };

        expect(result).toEqual(expected);
      });
    });
  });
});

const notFoundLog = new LogMessageDefinition(
  'NOT-FOUND',
  playerInfo.name,
  'Discard Key failed, required item was not found in inventory'
);

const eventUseMasterKey = actionableEvent(
  actionUseDiscardKey,
  interactiveInfo.id
);

const actor = instance(mockedPlayerEntity);

const extras = {
  target: instance(mockedInteractiveEntity),
};
