import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { ItemStore } from '../stores/item.store';
import { EquipRule } from './equip.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

import {
  mockedExtractorHelper,
  mockedInventoryService,
  mockedItemStore,
  mockedPlayerEntity,
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionEquip,
  greatSword,
  playerInfo,
  simpleSword,
} from '../../../tests/fakes';
import { LogMessageDefinition } from '../definitions/log-message.definition';

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
          provide: ItemStore,
          useValue: instance(mockedItemStore),
        },
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
        {
          provide: StringMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(
      mockedStringMessagesStoreService.createEquippedLogMessage(
        playerInfo.name,
        simpleSword.identity.label
      )
    ).thenReturn(logEquip);

    when(
      mockedStringMessagesStoreService.createUnEquippedLogMessage(
        playerInfo.name,
        simpleSword.identity.label
      )
    ).thenReturn(logUnEquip);

    when(
      mockedStringMessagesStoreService.createEquipErrorLogMessage(
        playerInfo.name,
        greatSword.skillName,
        greatSword.identity.label
      )
    ).thenReturn(logError);

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
    describe('when a previous weapon was equipped', () => {
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
  });
});

const eventOk = actionableEvent(actionEquip, simpleSword.identity.name);

const eventNoSkill = actionableEvent(actionEquip, greatSword.identity.name);

const logEquip = new LogMessageDefinition(
  'EQUIPPED',
  playerInfo.name,
  simpleSword.identity.label
);

const logUnEquip = new LogMessageDefinition(
  'UNEQUIPPED',
  playerInfo.name,
  simpleSword.identity.label
);

const logError = new LogMessageDefinition(
  'EQUIP-ERROR',
  playerInfo.name,
  `${greatSword.skillName}-${greatSword.identity.label}`
);
