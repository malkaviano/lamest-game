import { instance, verify, when } from 'ts-mockito';

import { EquipRule } from './equip.rule';
import { WeaponDefinition } from '@core/definitions/weapon.definition';
import { LogMessageDefinition } from '@core/definitions/log-message.definition';
import { GameStringsStore } from '../../stores/game-strings.store';
import { RuleResultInterface } from '@core/interfaces/rule-result.interface';

import {
  mockedCheckedService,
  mockedGamePredicate,
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionEquip,
  consumableAnalgesic,
  greatSword,
  playerInfo,
  simpleSword,
  unDodgeableAxe,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('EquipRule', () => {
  let rule: EquipRule;

  beforeEach(() => {
    setupMocks();

    rule = new EquipRule(
      instance(mockedInventoryService),
      instance(mockedCheckedService),
      instance(mockedGamePredicate)
    );

    when(
      mockedCheckedService.lookItemOrThrow<WeaponDefinition>(
        instance(mockedInventoryService),
        playerInfo.id,
        consumableAnalgesic.identity.name
      )
    ).thenThrow(new Error(GameStringsStore.errorMessages['WRONG-ITEM']));

    when(
      mockedCheckedService.lookItemOrThrow<WeaponDefinition>(
        instance(mockedInventoryService),
        playerInfo.id,
        simpleSword.identity.name
      )
    ).thenReturn(simpleSword);

    when(
      mockedCheckedService.takeItemOrThrow<WeaponDefinition>(
        instance(mockedInventoryService),
        actor.id,
        simpleSword.identity.name
      )
    ).thenReturn(simpleSword);

    when(mockedPlayerEntity.equip(simpleSword)).thenReturn(unDodgeableAxe);

    when(
      mockedCheckedService.lookItemOrThrow<WeaponDefinition>(
        instance(mockedInventoryService),
        playerInfo.id,
        greatSword.identity.name
      )
    ).thenReturn(greatSword);
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was not a weapon', () => {
      it('throw Wrong item was used', () => {
        expect(() =>
          rule.execute(instance(mockedPlayerEntity), eventWrong)
        ).toThrowError(GameStringsStore.errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was a weapon', () => {
      describe('when skill value was above zero', () => {
        it('should log item was equipped and produce side effects', (done) => {
          when(mockedGamePredicate.canEquip(actor, simpleSword)).thenReturn(
            true
          );

          ruleScenario(
            rule,
            actor,
            eventOk,
            extras,
            [unEquipLog, equipLog],
            done
          );

          // cheap side effect verification
          verify(mockedPlayerEntity.equip(simpleSword)).once();

          verify(
            mockedInventoryService.store(playerInfo.id, unDodgeableAxe)
          ).once();
        });

        it('return equipped result', () => {
          when(mockedGamePredicate.canEquip(actor, simpleSword)).thenReturn(
            true
          );

          const result = rule.execute(actor, eventOk);

          const expected: RuleResultInterface = {
            name: 'EQUIP',
            event: eventOk,
            actor,
            result: 'EXECUTED',
            equipped: simpleSword,
            unequipped: unDodgeableAxe,
            skill: {
              name: simpleSword.skillName,
            },
          };

          expect(result).toEqual(expected);
        });
      });

      describe('when skill value was zero or not set', () => {
        it('return denied result', () => {
          const result = rule.execute(actor, eventNoSkill);

          when(mockedGamePredicate.canEquip(actor, greatSword)).thenReturn(
            false
          );

          const expected: RuleResultInterface = {
            name: 'EQUIP',
            event: eventNoSkill,
            actor,
            result: 'DENIED',
            skill: {
              name: greatSword.skillName,
            },
          };

          expect(result).toEqual(expected);
        });
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const extras = {};

const eventWrong = actionableEvent(
  actionEquip,
  consumableAnalgesic.identity.name
);

const eventOk = actionableEvent(actionEquip, simpleSword.identity.name);

const eventNoSkill = actionableEvent(actionEquip, greatSword.identity.name);

const equipLog = new LogMessageDefinition(
  'EQUIPPED',
  playerInfo.name,
  'equipped Sword'
);

const unEquipLog = new LogMessageDefinition(
  'UNEQUIPPED',
  playerInfo.name,
  'un-equipped Axe'
);
