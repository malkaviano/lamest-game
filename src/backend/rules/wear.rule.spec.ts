import { instance, verify, when } from 'ts-mockito';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { GameStringsStore } from '@stores/game-strings.store';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import {
  equipActionable,
  wearActionable,
} from '@definitions/actionable.definition';
import { ArmorDefinition } from '@definitions/armor.definition';
import { WearRule } from '@rules/wear.rule';

import {
  mockedCheckedService,
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  consumableAnalgesic,
  kevlarVest,
  leatherJacket,
  playerInfo,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('WearRule', () => {
  let rule: WearRule;

  beforeEach(() => {
    setupMocks();

    rule = new WearRule(
      instance(mockedInventoryService),
      instance(mockedCheckedService)
    );

    when(
      mockedCheckedService.takeItemOrThrow<ArmorDefinition>(
        instance(mockedInventoryService),
        playerInfo.id,
        consumableAnalgesic.identity.name
      )
    ).thenThrow(new Error(GameStringsStore.errorMessages['WRONG-ITEM']));

    when(
      mockedCheckedService.takeItemOrThrow<ArmorDefinition>(
        instance(mockedInventoryService),
        actor.id,
        leatherJacket.identity.name
      )
    ).thenReturn(leatherJacket);

    when(mockedPlayerEntity.wear(leatherJacket)).thenReturn(kevlarVest);

    when(mockedInventoryService.store(actor.id, kevlarVest)).thenReturn(1);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was not armor', () => {
      it('throw Wrong item was used', () => {
        expect(() =>
          rule.execute(instance(mockedPlayerEntity), eventWrong)
        ).toThrowError(GameStringsStore.errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was a armor', () => {
      it('log wearing armor and strip armor', (done) => {
        ruleScenario(rule, actor, eventOk, extras, [stripLog, wearLog], done);

        // cheap side effect verification
        verify(mockedPlayerEntity.wear(leatherJacket)).once();

        verify(mockedInventoryService.store(playerInfo.id, kevlarVest)).once();
      });

      it('return equipped result', () => {
        const result = rule.execute(actor, eventOk);

        const expected: RuleResultInterface = {
          name: 'WEAR',
          event: eventOk,
          actor,
          result: 'EXECUTED',
          wearing: leatherJacket,
          strip: kevlarVest,
        };

        expect(result).toEqual(expected);
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const extras = {};

const eventWrong = actionableEvent(
  equipActionable,
  consumableAnalgesic.identity.name
);

const eventOk = actionableEvent(wearActionable, leatherJacket.identity.name);

const wearLog = new LogMessageDefinition(
  'WEARING',
  playerInfo.name,
  'wearing Leather Jacket'
);

const stripLog = new LogMessageDefinition(
  'STRIP',
  playerInfo.name,
  'strip Kevlar Vest'
);
