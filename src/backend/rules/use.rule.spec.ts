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
  actionUseMasterKey,
  masterKey,
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
        masterKey.identity.name
      )
    ).thenReturn(masterKey);
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
          mockedInventoryService.look(playerInfo.id, masterKey.identity.name)
        ).thenReturn(masterKey);

        const result = rule.execute(actor, eventUseMasterKey, extras);

        const expected: RuleResult = {
          name: 'USE',
          event: eventUseMasterKey,
          result: 'EXECUTED',
          actor,
          target: extras.target,
          used: masterKey,
        };

        expect(result).toEqual(expected);
      });
    });
  });
});

const notFoundLog = new LogMessageDefinition(
  'NOT-FOUND',
  playerInfo.name,
  'Master Key failed, required item was not found in inventory'
);

const eventUseMasterKey = actionableEvent(
  actionUseMasterKey,
  interactiveInfo.id
);

const actor = instance(mockedPlayerEntity);

const extras = {
  target: instance(mockedInteractiveEntity),
};
