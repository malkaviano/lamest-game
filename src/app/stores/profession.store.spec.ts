import { TestBed } from '@angular/core/testing';

import { instance } from 'ts-mockito';

import { ConverterHelper } from '../helpers/converter.helper';
import { ProfessionStore } from './profession.store';
import { ResourcesStore } from './resources.store';

import {
  mockedConverterHelper,
  mockedResourcesStore,
  setupMocks,
} from '../../../tests/mocks';

describe('ProfessionStore', () => {
  let service: ProfessionStore;

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

    service = TestBed.inject(ProfessionStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
