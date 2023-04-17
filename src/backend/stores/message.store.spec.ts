import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { ConverterHelper } from '../helpers/converter.helper';
import { MessageStore } from './message.store';
import { ResourcesStore } from './resources.store';

import {
  mockedConverterHelper,
  mockedResourcesStore,
  setupMocks,
} from '../../../tests/mocks';

describe('MessageStore', () => {
  let service: MessageStore;

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
      ],
    });

    setupMocks();

    when(mockedResourcesStore.messageStore).thenReturn({
      messages: [],
    });

    service = TestBed.inject(MessageStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
