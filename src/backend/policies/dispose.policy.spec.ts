import { instance, when } from 'ts-mockito';

import { DisposePolicy } from '@policies/dispose.policy';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
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
  actionUseMasterKey,
  actionableEvent,
  consumableFirstAid,
  interactiveInfo,
  masterKey,
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
  masterKey.identity.name
);

const eventUseMasterKey = actionableEvent(
  actionUseMasterKey,
  masterKey.identity.name
);

const actor = instance(mockedPlayerEntity);

const target = instance(mockedActorEntity);

const executedAffectResult: RuleResultInterface = {
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

const executedEquipResult: RuleResultInterface = {
  name: 'EQUIP',
  event: eventEquipMolotov,
  actor,
  result: 'EXECUTED',
  target,
  equipped: molotov,
  skillName: molotov.skillName,
};

const deniedResult: RuleResultInterface = {
  name: 'AFFECT',
  event: eventAttackInteractive,
  actor,
  result: 'DENIED',
  target,
  affected: molotov,
  skillName: molotov.skillName,
};

const executedConsumeResult: RuleResultInterface = {
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

const executedDropResult: RuleResultInterface = {
  name: 'DROP',
  event: eventDropMasterKey,
  actor,
  result: 'EXECUTED',
  target,
  dropped: masterKey,
};

const executedUseResult: RuleResultInterface = {
  name: 'USE',
  event: eventUseMasterKey,
  actor,
  result: 'EXECUTED',
  target,
  used: masterKey,
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
  masterKey.identity.label
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
        masterKey.identity.name
      )
    ).thenReturn(masterKey);
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
          disposed: masterKey,
        },
        log: lostMasterKeyLog,
        equipped: molotov,
      },
      {
        ruleResult: executedUseResult,
        expected: {
          disposed: masterKey,
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
