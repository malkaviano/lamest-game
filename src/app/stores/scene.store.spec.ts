import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { ConverterHelper } from '../helpers/converter.helper';
import { DescriptionStore } from './description.store';
import { InteractiveStore } from './interactive.store';
import { ResourcesStore } from './resources.store';
import { SceneStore } from './scene.store';

describe('SceneStore', () => {
  let service: SceneStore;

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
          provide: DescriptionStore,
          useValue: instance(mockedDescriptionStore),
        },
        {
          provide: InteractiveStore,
          useValue: instance(mockedInteractiveStore),
        },
      ],
    });

    when(mockedResourcesStore.sceneStore).thenReturn({
      scenes: [],
    });

    when(mockedDescriptionStore.descriptions).thenReturn({});

    when(mockedInteractiveStore.interactives).thenReturn({});

    service = TestBed.inject(SceneStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

const mockedConverterHelper = mock(ConverterHelper);

const mockedResourcesStore = mock(ResourcesStore);

const mockedDescriptionStore = mock(DescriptionStore);

const mockedInteractiveStore = mock(InteractiveStore);
