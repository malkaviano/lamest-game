import { TestBed } from '@angular/core/testing';

import { instance, verify, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { EquipRule } from './equip.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { GameMessagesStoreService } from '../stores/game-messages.store.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { errorMessages } from '../definitions/error-messages.definition';

import {
  mockedExtractorHelper,
  mockedInventoryService,
  mockedPlayerEntity,
  mockedStringMessagesStoreService,
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
  let service: EquipRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
        {
          provide: GameMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(EquipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
          service.execute(instance(mockedPlayerEntity), eventWrong)
        ).toThrowError(errorMessages['WRONG-ITEM']);
      });
    });

    describe('when item was a weapon', () => {
      it('should log item was equipped and produce side effects', () => {
        when(
          mockedInventoryService.look<WeaponDefinition>(
            playerInfo.id,
            simpleSword.identity.name
          )
        ).thenReturn(simpleSword);

        when(
          mockedExtractorHelper.extractItemOrThrow<WeaponDefinition>(
            instance(mockedInventoryService),
            actor.id,
            simpleSword.identity.name
          )
        ).thenReturn(simpleSword);

        when(mockedPlayerEntity.equip(simpleSword)).thenReturn(unDodgeableAxe);

        when(
          mockedStringMessagesStoreService.createUnEquippedLogMessage(
            playerInfo.name,
            unDodgeableAxe.identity.label
          )
        ).thenReturn(unEquipLog);

        when(
          mockedStringMessagesStoreService.createEquippedLogMessage(
            playerInfo.name,
            simpleSword.identity.label
          )
        ).thenReturn(equipLog);

        ruleScenario(service, actor, eventOk, extras, [unEquipLog, equipLog]);

        // cheap side effect verification
        verify(mockedPlayerEntity.equip(simpleSword)).once();

        verify(
          mockedInventoryService.store(playerInfo.id, unDodgeableAxe)
        ).once();
      });

      describe('when skill value was zero or not set', () => {
        it('should log error equipping and no side effects', () => {
          when(
            mockedInventoryService.look<WeaponDefinition>(
              playerInfo.id,
              greatSword.identity.name
            )
          ).thenReturn(greatSword);

          when(
            mockedStringMessagesStoreService.createEquipErrorLogMessage(
              playerInfo.name,
              greatSword.skillName,
              greatSword.identity.label
            )
          ).thenReturn(errorLog);

          ruleScenario(service, actor, eventNoSkill, extras, [errorLog]);

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
  simpleSword.identity.label
);

const unEquipLog = new LogMessageDefinition(
  'UNEQUIPPED',
  playerInfo.name,
  unDodgeableAxe.identity.label
);

const errorLog = new LogMessageDefinition(
  'EQUIP-ERROR',
  playerInfo.name,
  `${greatSword.skillName}-${greatSword.identity.label}`
);
