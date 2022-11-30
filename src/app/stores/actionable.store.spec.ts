import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { ConverterHelper } from '../helpers/converter.helper';
import { ActionableStore } from './actionable.store';
import { ResourcesStore } from './resources.store';

describe('ActionableStore', () => {
  let service: ActionableStore;

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

    when(mockedResourcesStore.actionableStore).thenReturn({
      actionables: [],
    });

    service = TestBed.inject(ActionableStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

const mockedConverterHelper = mock(ConverterHelper);

const mockedResourcesStore = mock(ResourcesStore);
