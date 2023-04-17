import { instance, when } from 'ts-mockito';

import { UseRule } from './use.rule';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';

import {
  mockedAffectedAxiomService,
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
  const rule = new UseRule(
    instance(mockedInventoryService),
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
    });

    describe('when item could be found', () => {
      it('should log item lost', (done) => {
        when(
          mockedInventoryService.take(playerInfo.id, masterKey.identity.name)
        ).thenReturn(masterKey);

        ruleScenario(
          rule,
          actor,
          eventUseMasterKey,
          extras,
          [itemLostLog],
          done
        );
      });
    });
  });
});

const notFoundLog = new LogMessageDefinition(
  'NOT-FOUND',
  playerInfo.name,
  'Master Key failed, required item was not found in inventory'
);

const itemLostLog = new LogMessageDefinition(
  'LOST',
  playerInfo.name,
  'lost Master Key'
);

const eventUseMasterKey = actionableEvent(
  actionUseMasterKey,
  interactiveInfo.id
);

const actor = instance(mockedPlayerEntity);

const extras = {
  target: instance(mockedInteractiveEntity),
};
