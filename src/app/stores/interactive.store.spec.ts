import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { ConverterHelper } from '../helpers/converter.helper';
import { InventoryService } from '../services/inventory.service';
import { InteractiveStore } from './interactive.store';
import { ItemStore } from './item.store';
import { ResourcesStore } from './resources.store';
import { StatesStore } from './states.store';

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
      ],
    });

    when(mockedResourcesStore.interactiveStore).thenReturn({
      interactives: [],
      usedItems: [],
    });

    when(mockedItemStore.items).thenReturn({});

    when(mockedStatesStore.states).thenReturn({});

    service = TestBed.inject(InteractiveStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

const mockedConverterHelper = mock(ConverterHelper);

const mockedResourcesStore = mock(ResourcesStore);

const mockedInventoryService = mock(InventoryService);

const mockedStatesStore = mock(StatesStore);

const mockedItemStore = mock(ItemStore);
