import { deepEqual, instance, when } from 'ts-mockito';

import { PickRule } from './pick.rule';
import { RuleResultInterface } from '@core/interfaces/rule-result.interface';

import {
  mockedAffectedAxiom,
  mockedCheckedService,
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionPickSimpleSword,
  interactiveInfo,
  simpleSword,
} from '../../../tests/fakes';

describe('PickRule', () => {
  let rule: PickRule;

  beforeEach(() => {
    setupMocks();

    rule = new PickRule(
      instance(mockedInventoryService),
      instance(mockedCheckedService),
      instance(mockedAffectedAxiom)
    );

    when(
      mockedCheckedService.takeItemOrThrow(
        instance(mockedInventoryService),
        eventPickSimpleSword.eventId,
        eventPickSimpleSword.actionableDefinition.name
      )
    ).thenReturn(simpleSword);

    when(
      mockedCheckedService.getRuleTargetOrThrow(
        deepEqual({ target: instance(mockedInteractiveEntity) })
      )
    ).thenReturn(instance(mockedInteractiveEntity));
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    it('should store the item', () => {
      const spy = spyOn(instance(mockedInventoryService), 'store');

      rule.execute(actor, eventPickSimpleSword, {
        target,
      });

      expect(spy).toHaveBeenCalledWith(actor.id, simpleSword);
    });

    it('should react to the action', () => {
      const spy = spyOn(instance(mockedAffectedAxiom), 'affectWith');

      rule.execute(actor, eventPickSimpleSword, {
        target,
      });

      expect(spy).toHaveBeenCalled();
    });

    it('return item picked', () => {
      const result = rule.execute(actor, eventPickSimpleSword, {
        target,
      });

      const expected: RuleResultInterface = {
        name: 'PICK',
        actor,
        event: eventPickSimpleSword,
        target,
        result: 'EXECUTED',
        picked: simpleSword,
      };

      expect(result).toEqual(expected);
    });
  });
});

const actor = instance(mockedPlayerEntity);

const target = instance(mockedInteractiveEntity);

const eventPickSimpleSword = actionableEvent(
  actionPickSimpleSword,
  interactiveInfo.id
);
