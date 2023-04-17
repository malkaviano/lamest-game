import { deepEqual, instance, when } from 'ts-mockito';

import { PickRule } from './pick.rule';

import {
  mockedAffectedAxiomService,
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
  const rule = new PickRule(
    instance(mockedInventoryService),
    instance(mockedCheckedService),
    instance(mockedAffectedAxiomService)
  );

  beforeEach(() => {
    setupMocks();

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
        target: instance(mockedInteractiveEntity),
      });

      expect(spy).toHaveBeenCalledWith(actor.id, simpleSword);
    });

    it('should react to the action', () => {
      const spy = spyOn(instance(mockedAffectedAxiomService), 'affectWith');

      rule.execute(actor, eventPickSimpleSword, {
        target: instance(mockedInteractiveEntity),
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});

const actor = instance(mockedPlayerEntity);

const eventPickSimpleSword = actionableEvent(
  actionPickSimpleSword,
  interactiveInfo.id
);
