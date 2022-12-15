import { TestBed } from '@angular/core/testing';

import { instance } from 'ts-mockito';

import { ResourcesStore } from './resources.store';
import { SettingsStore } from './settings.store';

import { mockedResourcesStore, setupMocks } from '../../../tests/mocks';

describe('SettingsStore', () => {
  let service: SettingsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ResourcesStore,
          useValue: instance(mockedResourcesStore),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(SettingsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
