import { TestBed } from '@angular/core/testing';

import { instance, mock, verify, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { createTookLogMessage } from '../definitions/log-message.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { PlayerEntity } from '../entities/player.entity';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { PickRule } from './pick.rule';

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
    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    service = TestBed.inject(PickRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      when(mockedInventoryService.take('id1', 'sword')).thenReturn(item);

      when(
        mockedInteractiveEntity.reactTo(event.actionableDefinition, 'NONE')
      ).thenReturn('Sword');

      const result = service.execute(
        instance(mockedCharacterEntity),
        event,
        instance(mockedInteractiveEntity)
      );

      verify(mockedInventoryService.store('player', item)).once();

      expect(result).toEqual({
        logs: [log],
      });
    });
  });
});

const mockedInventoryService = mock(InventoryService);

const mockedCharacterEntity = mock(PlayerEntity);

const item = new WeaponDefinition(
  'sword',
  'Sword',
  'some sword',
  'Artillery (Siege)',
  new DamageDefinition(createDice(), 2),
  true,
  'PERMANENT'
);

const action = createActionableDefinition('PICK', 'sword', 'Sword');

const event = new ActionableEvent(action, 'id1');

const mockedInteractiveEntity = mock(InteractiveEntity);

const log = createTookLogMessage('player', 'test', 'Sword');
