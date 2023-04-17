import { instance, verify, when } from 'ts-mockito';

import { EquipRule } from './equip.rule';
import { WeaponDefinition } from '../../core/definitions/weapon.definition';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { GameStringsStore } from '../../stores/game-strings.store';

import {
  mockedCheckedService,
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
  const rule = new EquipRule(
    instance(mockedInventoryService),
    instance(mockedCheckedService)
  );

  beforeEach(() => {
    setupMocks();
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    describe('when item was not a weapon', () => {
      it('throw Wrong item was used', () => {
        when(
          mockedInventoryService.look<WeaponDefinition>(
            playerInfo.id,
            consumableAnalgesic.identity.name
          )
        ).thenReturn(null);

        expect(() =>
          rule.execute(instance(mockedPlayerEntity), eventWrong)
        ).toThrowError(GameStringsStore.errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was a weapon', () => {
      it('should log item was equipped and produce side effects', (done) => {
        when(
          mockedInventoryService.look<WeaponDefinition>(
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

      describe('when skill value was zero or not set', () => {
        it('should log error equipping and no side effects', (done) => {
          when(
            mockedInventoryService.look<WeaponDefinition>(
              playerInfo.id,
              greatSword.identity.name
            )
          ).thenReturn(greatSword);

          ruleScenario(rule, actor, eventNoSkill, extras, [errorLog], done);

          // cheap side effect verification
          verify(mockedPlayerEntity.equip(greatSword)).never();

          verify(
            mockedInventoryService.store(playerInfo.id, unDodgeableAxe)
          ).never();
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

const errorLog = new LogMessageDefinition(
  'EQUIP-ERROR',
  playerInfo.name,
  'Melee Weapon (Great) is required to equip Great Sword'
);
