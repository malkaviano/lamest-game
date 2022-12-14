import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';
import {
  mockedConverterHelper,
  mockedResourcesStore,
} from '../../../tests/mocks';

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
