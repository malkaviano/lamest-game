import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import {
  createEquipErrorLogMessage,
  createEquippedLogMessage,
  createUnEquippedLogMessage,
} from '../definitions/log-message.definition';
import { InventoryService } from '../services/inventory.service';
import { ItemStore } from '../stores/item.store';
import { EquipRule } from './equip.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';

import {
  mockedExtractorHelper,
  mockedInventoryService,
  mockedItemStore,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionEquip,
  greatSword,
  playerInfo,
  simpleSword,
} from '../../../tests/fakes';
import { WeaponDefinition } from '../definitions/weapon.definition';

fdescribe('EquipRule', () => {
  let service: EquipRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: ItemStore,
          useValue: instance(mockedItemStore),
        },
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
      ],
    });

    setupMocks();

    when(mockedItemStore.itemSkill(eventOk.eventId)).thenReturn(
      'Melee Weapon (Simple)'
    );

    when(mockedItemStore.itemSkill(eventNoSkill.eventId)).thenReturn(
      'Melee Weapon (Great)'
    );

    when(mockedItemStore.itemLabel(eventNoSkill.eventId)).thenReturn(
      greatSword.identity.label
    );

    when(
      mockedExtractorHelper.extractItemOrThrow<WeaponDefinition>(
        instance(mockedInventoryService),
        playerInfo.id,
        simpleSword.identity.name
      )
    ).thenReturn(simpleSword);

    service = TestBed.inject(EquipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when skill value is above 0', () => {
      it('return logs', () => {
        when(mockedPlayerEntity.equip(simpleSword)).thenReturn(null);

        when(
          mockedInventoryService.take(playerInfo.id, simpleSword.identity.name)
        ).thenReturn(simpleSword);

        const result = service.execute(instance(mockedPlayerEntity), eventOk);

        expect(result).toEqual({
          logs: [logEquip],
        });
      });
    });

    describe('when a previous weapon was equipped', () => {
      it('return logs', () => {
        when(mockedPlayerEntity.equip(simpleSword)).thenReturn(simpleSword);

        when(
          mockedInventoryService.take(playerInfo.id, simpleSword.identity.name)
        ).thenReturn(simpleSword);

        const result = service.execute(instance(mockedPlayerEntity), eventOk);

        expect(result).toEqual({
          logs: [logUnEquip, logEquip],
        });
      });

      it('should store previous weapon', () => {
        let result = 0;

        when(mockedPlayerEntity.equip(simpleSword)).thenReturn(simpleSword);

        when(
          mockedInventoryService.take(playerInfo.id, simpleSword.identity.name)
        ).thenReturn(simpleSword);

        when(mockedInventoryService.store(playerInfo.id, simpleSword)).thenCall(
          () => (result = 1)
        );

        service.execute(instance(mockedPlayerEntity), eventOk);

        expect(result).toEqual(1);
      });
    });

    describe('when skill value is 0', () => {
      it('return logs', () => {
        const result = service.execute(
          instance(mockedPlayerEntity),
          eventNoSkill
        );

        expect(result).toEqual({
          logs: [logError],
        });
      });
    });
  });
});

const eventOk = actionableEvent(actionEquip, simpleSword.identity.name);

const eventNoSkill = actionableEvent(actionEquip, greatSword.identity.name);

const logEquip = createEquippedLogMessage(
  playerInfo.name,
  simpleSword.identity.label
);

const logUnEquip = createUnEquippedLogMessage(
  playerInfo.name,
  simpleSword.identity.label
);

const logError = createEquipErrorLogMessage(
  playerInfo.name,
  greatSword.skillName,
  greatSword.identity.label
);
