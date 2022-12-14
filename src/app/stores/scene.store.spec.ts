import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';
import {
  mockedActorStore,
  mockedConverterHelper,
  mockedDescriptionStore,
  mockedInteractiveStore,
  mockedResourcesStore,
} from '../../../tests/mocks';

import { ConverterHelper } from '../helpers/converter.helper';
import { ActorStore } from './actor.store';
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
        {
          provide: ActorStore,
          useValue: instance(mockedActorStore),
        },
      ],
    });

    when(mockedResourcesStore.sceneStore).thenReturn({
      scenes: [],
      initial: '',
    });

    when(mockedDescriptionStore.descriptions).thenReturn({});

    when(mockedInteractiveStore.interactives).thenReturn({});

    service = TestBed.inject(SceneStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
