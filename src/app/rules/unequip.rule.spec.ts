import { TestBed } from '@angular/core/testing';

import { instance, mock, verify } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { UnequipRule } from './unequip.rule';

describe('UnequipRule', () => {
  let service: UnequipRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
      ],
    });

    service = TestBed.inject(UnequipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logss', () => {
      const logs = service.execute(
        new ActionableEvent(
          createActionableDefinition('UNEQUIP', 'unequip', 'Sword'),
          'someId'
        )
      );

      verify(mockedInventoryService.unequip()).once();

      expect(logs).toEqual({
        logs: ['unequipped: Sword'],
      });
    });
  });
});

const mockedInventoryService = mock(InventoryService);
