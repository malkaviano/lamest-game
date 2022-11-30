import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { ConverterHelper } from '../helpers/converter.helper';
import { MessageStore } from './message.store';
import { ResourcesStore } from './resources.store';

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

    when(mockedResourcesStore.messageStore).thenReturn({
      messages: [],
    });

    service = TestBed.inject(MessageStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

const mockedConverterHelper = mock(ConverterHelper);

const mockedResourcesStore = mock(ResourcesStore);
