import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { createUnEquippedLogMessage } from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { UnEquipRule } from './unequip.rule';

import {
  mockedPlayerEntity,
  mockedInventoryService,
  setupMocks,
} from '../../../tests/mocks';
import { unDodgeableAxe } from '../../../tests/fakes';

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

  describe('execute', () => {
    it('return logs', () => {
      when(mockedInventoryService.store('player', unDodgeableAxe)).thenReturn(
        1
      );

      when(mockedPlayerEntity.unEquip()).thenReturn(unDodgeableAxe);

      const logs = service.execute(
        instance(mockedPlayerEntity),
        new ActionableEvent(
          createActionableDefinition('UNEQUIP', 'unequip', 'Sword'),
          'someId'
        )
      );

      expect(logs).toEqual({
        logs: [log],
      });
    });
  });
});

const log = createUnEquippedLogMessage('player', 'Sword');
