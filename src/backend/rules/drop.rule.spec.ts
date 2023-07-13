import { instance, when } from 'ts-mockito';

import { DropRule } from '@rules/drop.rule';
import { dropActionable } from '@definitions/actionable.definition';

import {
  mockedCheckedService,
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import { actionableEvent, simpleSword } from '../../../tests/fakes';

describe('DropRule', () => {
  const rule = new DropRule(
    instance(mockedInventoryService),
    instance(mockedCheckedService)
  );

  beforeEach(() => {
    setupMocks();

    when(
      mockedCheckedService.lookItemOrThrow(
        instance(mockedInventoryService),
        actor.id,
        simpleSword.identity.name
      )
    ).thenReturn(simpleSword);
  });

  it('should create an instance', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    it('return rule result', () => {
      const result = rule.execute(actor, event, {});

      expect(result).toEqual({
        name: 'DROP',
        actor,
        event,
        result: 'EXECUTED',
        dropped: simpleSword,
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const event = actionableEvent(dropActionable, simpleSword.identity.name);
