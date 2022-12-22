import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { ConverterHelper } from '../helpers/converter.helper';
import { InventoryService } from '../services/inventory.service';
import { InteractiveStore } from './interactive.store';
import { ItemStore } from './item.store';
import { ResourcesStore } from './resources.store';
import { StatesStore } from './states.store';
import { GameMessagesStoreService } from './game-messages.store.service';

import {
  mockedConverterHelper,
  mockedInventoryService,
  mockedItemStore,
  mockedResourcesStore,
  mockedStatesStore,
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';

describe('InteractiveStore', () => {
  let service: InteractiveStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConverterHelper,
          useValue: instance(mockedConverterHelper),
        },
        {
          provide: ResourcesStore,
          useValue: instance(mockedResourcesStore),
        },
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: StatesStore,
          useValue: instance(mockedStatesStore),
        },
        {
          provide: ItemStore,
          useValue: instance(mockedItemStore),
        },
        {
          provide: GameMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(mockedResourcesStore.interactiveStore).thenReturn({
      interactives: [],
      inventoryItems: [],
    });

    when(mockedItemStore.items).thenReturn({});

    when(mockedStatesStore.states).thenReturn({});

    service = TestBed.inject(InteractiveStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
