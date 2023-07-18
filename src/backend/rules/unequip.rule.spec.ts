import { instance, verify, when } from 'ts-mockito';

import { UnEquipRule } from '@rules/unequip.rule';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActionableEvent } from '@events/actionable.event';
import { RuleResult } from '@results/rule.result';
import { unequipActionable } from '@definitions/actionable.definition';

import {
  mockedPlayerEntity,
  mockedInventoryService,
  setupMocks,
} from '../../../tests/mocks';
import { playerInfo, simpleSword, unDodgeableAxe } from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('UnEquipRule', () => {
  let rule: UnEquipRule;

  const actor = instance(mockedPlayerEntity);

  beforeEach(() => {
    setupMocks();

    rule = new UnEquipRule(instance(mockedInventoryService));

    when(mockedPlayerEntity.unEquip()).thenReturn(unDodgeableAxe);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('when a weapon was equipped', () => {
    it('should log weapon unequipped', (done) => {
      ruleScenario(rule, actor, unEquipEvent, {}, [unEquippedLog], done);
    });

    it('return unequipped result', () => {
      const result = rule.execute(actor, unEquipEvent);

      verify(mockedInventoryService.store(actor.id, unDodgeableAxe)).once();

      const expected: RuleResult = {
        name: 'UNEQUIP',
        event: unEquipEvent,
        result: 'EXECUTED',
        actor,
        unequipped: unDodgeableAxe,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('when no weapon was equipped', () => {
    it('return denied result', () => {
      when(mockedPlayerEntity.unEquip()).thenReturn(null);

      const result = rule.execute(actor, unEquipEvent);

      verify(mockedInventoryService.store(actor.id, simpleSword)).never();

      const expected: RuleResult = {
        name: 'UNEQUIP',
        event: unEquipEvent,
        result: 'DENIED',
        actor,
      };

      expect(result).toEqual(expected);
    });
  });
});

const unEquippedLog = new LogMessageDefinition(
  'UNEQUIPPED',
  playerInfo.name,
  'un-equipped Axe'
);

const unEquipEvent = new ActionableEvent(
  unequipActionable,
  unDodgeableAxe.identity.name
);
