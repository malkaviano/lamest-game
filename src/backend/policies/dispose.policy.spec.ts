import { instance, when } from 'ts-mockito';

import { DisposePolicy } from '@policies/dispose.policy';
import { RuleResult } from '@results/rule.result';
import { unarmedWeapon } from '@behaviors/equipment.behavior';
import { GameStringsStore } from '@stores/game-strings.store';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import {
  dropActionable,
  equipActionable,
} from '@definitions/actionable.definition';

import {
  mockedActorEntity,
  mockedCheckedService,
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionAffect,
  actionConsume,
  actionUseDiscardKey,
  actionableEvent,
  consumableFirstAid,
  interactiveInfo,
  discardKey,
  molotov,
  playerInfo,
} from '../../../tests/fakes';

const eventAttackInteractive = actionableEvent(
  actionAffect,
  molotov.identity.name
);

const eventEquipMolotov = actionableEvent(equipActionable, interactiveInfo.id);

const eventConsumeFirstAid = actionableEvent(
  actionConsume,
  consumableFirstAid.identity.name
);

const eventDropMasterKey = actionableEvent(
  dropActionable,
  discardKey.identity.name
);

const eventUseMasterKey = actionableEvent(
  actionUseDiscardKey,
  discardKey.identity.name
);

const actor = instance(mockedPlayerEntity);

const target = instance(mockedActorEntity);

const executedAffectResult: RuleResult = {
  name: 'AFFECT',
  event: eventAttackInteractive,
  actor,
  result: 'EXECUTED',
  target,
  affected: molotov,
  skillName: molotov.skillName,
  roll: { checkRoll: 5, result: 'SUCCESS' },
  dodged: false,
  effect: { type: 'FIRE', amount: 5 },
};

const executedEquipResult: RuleResult = {
  name: 'EQUIP',
  event: eventEquipMolotov,
  actor,
  result: 'EXECUTED',
  target,
  equipped: molotov,
  skillName: molotov.skillName,
};

const deniedResult: RuleResult = {
  name: 'AFFECT',
  event: eventAttackInteractive,
  actor,
  result: 'DENIED',
  target,
  affected: molotov,
  skillName: molotov.skillName,
};

const executedConsumeResult: RuleResult = {
  name: 'CONSUME',
  event: eventConsumeFirstAid,
  actor,
  result: 'EXECUTED',
  target,
  consumable: {
    consumed: consumableFirstAid,
    hp: consumableFirstAid.hp,
    energy: consumableFirstAid.energy,
  },
  skillName: consumableFirstAid.skillName,
  roll: { checkRoll: 5, result: 'SUCCESS' },
};

const executedDropResult: RuleResult = {
  name: 'DROP',
  event: eventDropMasterKey,
  actor,
  result: 'EXECUTED',
  target,
  dropped: discardKey,
};

const executedUseResult: RuleResult = {
  name: 'USE',
  event: eventUseMasterKey,
  actor,
  result: 'EXECUTED',
  target,
  used: discardKey,
};

const lostMolotovLog = GameStringsStore.createLostItemLogMessage(
  playerInfo.name,
  molotov.identity.label
);

const lostFirstAidLog = GameStringsStore.createLostItemLogMessage(
  playerInfo.name,
  consumableFirstAid.identity.label
);

const lostMasterKeyLog = GameStringsStore.createLostItemLogMessage(
  playerInfo.name,
  discardKey.identity.label
);

describe('DisposePolicy', () => {
  const policy = new DisposePolicy(
    instance(mockedInventoryService),
    instance(mockedCheckedService)
  );

  beforeEach(() => {
    setupMocks();

    when(mockedPlayerEntity.weaponEquipped)
      .thenReturn(molotov)
      .thenReturn(unarmedWeapon);

    when(mockedPlayerEntity.unEquip()).thenReturn(molotov);

    when(
      mockedCheckedService.takeItemOrThrow(
        instance(mockedInventoryService),
        actor.id,
        consumableFirstAid.identity.name
      )
    ).thenReturn(consumableFirstAid);

    when(
      mockedCheckedService.takeItemOrThrow(
        instance(mockedInventoryService),
        actor.id,
        discardKey.identity.name
      )
    ).thenReturn(discardKey);
  });

  it('should create an instance', () => {
    expect(policy).toBeTruthy();
  });

  describe('enforce', () => {
    [
      {
        ruleResult: executedAffectResult,
        expected: {
          disposed: molotov,
        },
        log: lostMolotovLog,
        equipped: unarmedWeapon,
      },
      {
        ruleResult: deniedResult,
        expected: {},
        log: undefined,
        equipped: molotov,
      },
      {
        ruleResult: executedEquipResult,
        expected: {},
        log: undefined,
        equipped: molotov,
      },
      {
        ruleResult: executedConsumeResult,
        expected: {
          disposed: consumableFirstAid,
        },
        log: lostFirstAidLog,
        equipped: molotov,
      },
      {
        ruleResult: executedDropResult,
        expected: {
          disposed: discardKey,
        },
        log: lostMasterKeyLog,
        equipped: molotov,
      },
      {
        ruleResult: executedUseResult,
        expected: {
          disposed: discardKey,
        },
        log: lostMasterKeyLog,
        equipped: molotov,
      },
    ].forEach(({ ruleResult, expected, log, equipped }) => {
      it('return policy result', () => {
        const result = policy.enforce(ruleResult);

        expect(result).toEqual(expected);
      });

      it('return actor unequipped', () => {
        policy.enforce(ruleResult);

        expect(actor.weaponEquipped).toEqual(equipped);
      });

      it('emit log', (done) => {
        let result: LogMessageDefinition | undefined;

        policy.logMessageProduced$.subscribe((event) => {
          result = event;
        });

        policy.enforce(ruleResult);

        done();

        expect(result).toEqual(log);
      });
    });
  });
});
