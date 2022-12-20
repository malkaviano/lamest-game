import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { ConverterHelper } from '../helpers/converter.helper';
import { ActorStore } from './actor.store';
import { ItemStore } from './item.store';
import { ResourcesStore } from './resources.store';
import { StatesStore } from './states.store';

import {
  mockedConverterHelper,
  mockedItemStore,
  mockedResourcesStore,
  mockedSkillStore,
  mockedStatesStore,
  mockedStringMessagesStoreService,
  setupMocks,
} from '../../../tests/mocks';
import { SkillStore } from './skill.store';
import { StringMessagesStoreService } from './string-messages.store.service';

describe('ActorStore', () => {
  let service: ActorStore;

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
          provide: StatesStore,
          useValue: instance(mockedStatesStore),
        },
        {
          provide: ItemStore,
          useValue: instance(mockedItemStore),
        },
        {
          provide: SkillStore,
          useValue: instance(mockedSkillStore),
        },
        {
          provide: StringMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(mockedResourcesStore.actorStore).thenReturn({
      actors: [],
    });

    service = TestBed.inject(ActorStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
