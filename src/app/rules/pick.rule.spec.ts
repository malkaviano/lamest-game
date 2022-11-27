import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';
import { createActionableDefinition } from '../definitions/actionable.definition';
import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';

import { InventoryService } from '../services/inventory.service';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';
import { DiscardState } from '../states/discard.state';
import { PickRule } from './pick.rule';

describe('PickRule', () => {
  let service: PickRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NarrativeService,
          useValue: instance(mockedNarrativeService),
        },
        {
          provide: LoggingService,
          useValue: instance(mockedLoggingService),
        },
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
      ],
    });

    when(mockedNarrativeService.interatives).thenReturn(interactives);

    service = TestBed.inject(PickRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should call inventory store', () => {
      let result: string[] = [];

      when(mockedInventoryService.take('i1', 'sword')).thenReturn(item);

      when(mockedInventoryService.store('player', item)).thenCall(() =>
        result.push('ok')
      );

      when(mockedLoggingService.log('player: took Sword from test')).thenCall(
        () => result.push('ok')
      );

      service.execute(event);

      expect(result).toEqual(['ok', 'ok']);
    });
  });
});

const mockedInventoryService = mock(InventoryService);

const mockedNarrativeService = mock(NarrativeService);

const mockedLoggingService = mock(LoggingService);

const item = new WeaponDefinition(
  'sword',
  'Sword',
  'some sword',
  'Artillery (Siege)',
  new DamageDefinition(createDice(), 2)
);

const action = createActionableDefinition('PICK', 'sword', 'Sword');

const event = new ActionableEvent(action, 'i1');

const interactives: KeyValueInterface<InteractiveEntity> = {
  i1: new InteractiveEntity('i1', 'test', 'test', new DiscardState([action])),
};
