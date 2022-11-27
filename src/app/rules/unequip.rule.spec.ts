import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { LoggingService } from '../services/logging.service';
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
        {
          provide: LoggingService,
          useValue: instance(mockedLoggingService),
        },
      ],
    });

    service = TestBed.inject(UnequipRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should call inventory unequip', () => {
      let result: string[] = [];

      when(mockedInventoryService.unequip()).thenCall(() => result.push('ok'));

      when(mockedLoggingService.log('unequipped: Sword')).thenCall(() =>
        result.push('ok')
      );

      service.execute(
        new ActionableEvent(
          createActionableDefinition('UNEQUIP', 'unequip', 'Sword'),
          'someId'
        )
      );

      expect(result).toEqual(['ok', 'ok']);
    });
  });
});

const mockedInventoryService = mock(InventoryService);

const mockedLoggingService = mock(LoggingService);
