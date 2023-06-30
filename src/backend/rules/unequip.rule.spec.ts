import { instance, verify, when } from 'ts-mockito';

import { UnEquipRule } from './unequip.rule';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { ActionableEvent } from '../../core/events/actionable.event';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

import {
  mockedPlayerEntity,
  mockedInventoryService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionUnEquip,
  playerInfo,
  simpleSword,
  unDodgeableAxe,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('UnEquipRule', () => {
  const rule = new UnEquipRule(instance(mockedInventoryService));

  const actor = instance(mockedPlayerEntity);

  beforeEach(() => {
    setupMocks();

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

      const expected: RuleResultInterface = {
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

      const expected: RuleResultInterface = {
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

const unEquipAction = actionUnEquip(unDodgeableAxe.identity.label);

const unEquipEvent = new ActionableEvent(
  unEquipAction,
  unDodgeableAxe.identity.name
);
