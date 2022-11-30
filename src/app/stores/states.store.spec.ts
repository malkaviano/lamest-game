import { TestBed } from '@angular/core/testing';

import { anything, instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { ConverterHelper } from '../helpers/converter.helper';
import { SimpleState } from '../states/simple.state';
import { ArrayView } from '../views/array.view';
import { ActionableStore } from './actionable.store';
import { ItemStore } from './item.store';
import { MessageStore } from './message.store';
import { ResourcesStore } from './resources.store';
import { StatesStore } from './states.store';

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
          provide: ItemStore,
          useValue: instance(mockedItemStore),
        },
      ],
    });

    when(mockedResourcesStore.simpleStateStore).thenReturn({
      states: [
        {
          interactiveId: 'id1',
          actionables: ['GG'],
        },
      ],
    });

    when(mockedResourcesStore.skillStateStore).thenReturn({
      states: [],
    });

    when(mockedResourcesStore.enemyStateStore).thenReturn({
      states: [],
    });

    when(mockedResourcesStore.destroyableStateStore).thenReturn({
      states: [],
    });

    when(mockedResourcesStore.discardStateStore).thenReturn({
      states: [],
    });

    when(mockedResourcesStore.conversationStateStore).thenReturn({
      states: [],
    });

    when(mockedConverterHelper.mapToKeyValueInterface(anything())).thenReturn({
      GG: state,
    });

    when(mockedActionableStore.actionables).thenReturn({
      GG: actionable,
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

const mockedConverterHelper = mock(ConverterHelper);

const mockedResourcesStore = mock(ResourcesStore);

const mockedMessageStore = mock(MessageStore);

const mockedActionableStore = mock(ActionableStore);

const mockedItemStore = mock(ItemStore);

const actionable = createActionableDefinition('CONSUME', 'GG');

const state = new SimpleState(new ArrayView([actionable]));
