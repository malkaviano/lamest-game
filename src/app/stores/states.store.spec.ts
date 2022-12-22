import { TestBed } from '@angular/core/testing';

import { anything, instance, when } from 'ts-mockito';

import { ConverterHelper } from '../helpers/converter.helper';
import { SimpleState } from '../states/simple.state';
import { ArrayView } from '../views/array.view';
import { ActionableStore } from './actionable.store';
import { MessageStore } from './message.store';
import { ResourcesStore } from './resources.store';
import { StatesStore } from './states.store';
import { GameMessagesStoreService } from './game-messages.store.service';

import {
  mockedActionableStore,
  mockedConverterHelper,
  mockedMessageStore,
  mockedResourcesStore,
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';
import { actionConsume } from '../../../tests/fakes';

describe('StatesStore', () => {
  let service: StatesStore;

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
          provide: MessageStore,
          useValue: instance(mockedMessageStore),
        },
        {
          provide: ActionableStore,
          useValue: instance(mockedActionableStore),
        },
        {
          provide: GameMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(mockedResourcesStore.simpleStateStore).thenReturn({
      states: [
        {
          id: 'id1',
          actionables: ['GG'],
        },
      ],
    });

    when(mockedConverterHelper.mapToKeyValueInterface(anything())).thenReturn({
      GG: state,
    });

    when(mockedActionableStore.actionables).thenReturn({
      GG: actionConsume,
    });

    service = TestBed.inject(StatesStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('lazyState', () => {
    it('return a lazy helper state', () => {
      const result = service.lazyState('GG');

      expect(result.value).toEqual(state);
    });
  });
});

const state = new SimpleState(ArrayView.create([actionConsume]));
