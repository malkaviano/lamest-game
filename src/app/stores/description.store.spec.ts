import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';
import {
  mockedConverterHelper,
  mockedResourcesStore,
} from '../../../tests/mocks';

import { ConverterHelper } from '../helpers/converter.helper';
import { DescriptionStore } from './description.store';
import { ResourcesStore } from './resources.store';

describe('DescriptionStore', () => {
  let service: DescriptionStore;

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

    when(mockedResourcesStore.descriptionStore).thenReturn({
      descriptions: [],
    });

    service = TestBed.inject(DescriptionStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
