import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { UnEquipRule } from './unequip.rule';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { ActionableEvent } from '../../core/events/actionable.event';

import {
  mockedPlayerEntity,
  mockedInventoryService,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionUnEquip,
  playerInfo,
  unDodgeableAxe,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('UnEquipRule', () => {
  let service: UnEquipRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(UnEquipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log weapon unequipped', (done) => {
    when(mockedPlayerEntity.unEquip()).thenReturn(unDodgeableAxe);

    ruleScenario(
      service,
      instance(mockedPlayerEntity),
      unEquipEvent,
      {},
      [unEquippedLog],
      done
    );
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
