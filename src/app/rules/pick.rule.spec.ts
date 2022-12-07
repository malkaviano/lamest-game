import { TestBed } from '@angular/core/testing';

import { instance, verify, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { createTookLogMessage } from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { PickRule } from './pick.rule';

import {
  mockedInteractiveEntity,
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import { simpleSword } from '../../../tests/fakes';

describe('PickRule', () => {
  let service: PickRule;

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

    service = TestBed.inject(PickRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      when(mockedInventoryService.take('id1', 'sword')).thenReturn(simpleSword);

      when(
        mockedInteractiveEntity.reactTo(event.actionableDefinition, 'NONE')
      ).thenReturn('Sword');

      const result = service.execute(
        instance(mockedPlayerEntity),
        event,
        instance(mockedInteractiveEntity)
      );

      verify(mockedInventoryService.store('player', simpleSword)).once();

      expect(result).toEqual({
        logs: [log],
      });
    });
  });
});

const action = createActionableDefinition('PICK', 'sword', 'Sword');

const event = new ActionableEvent(action, 'id1');

const log = createTookLogMessage('player', 'test', 'Sword');
