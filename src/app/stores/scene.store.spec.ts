import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { ConverterHelper } from '../helpers/converter.helper';
import { ActorStore } from './actor.store';
import { InteractiveStore } from './interactive.store';
import { ResourcesStore } from './resources.store';
import { SceneStore } from './scene.store';

import {
  mockedActorStore,
  mockedConverterHelper,
  mockedInteractiveStore,
  mockedResourcesStore,
  setupMocks,
} from '../../../tests/mocks';

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
          provide: InteractiveStore,
          useValue: instance(mockedInteractiveStore),
        },
        {
          provide: ActorStore,
          useValue: instance(mockedActorStore),
        },
      ],
    });

    setupMocks();

    when(mockedResourcesStore.sceneStore).thenReturn({
      scenes: [],
      initial: '',
    });

    when(mockedInteractiveStore.interactives).thenReturn({});

    service = TestBed.inject(SceneStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
