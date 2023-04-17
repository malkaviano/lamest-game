import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { SceneDefinition } from '../definitions/scene.definition';
import { SceneStore } from '../stores/scene.store';
import { NarrativeService } from './narrative.service';
import { ArrayView } from '../view-models/array.view';
import { GameStringsStore } from '../stores/game-strings.store';

import {
  mockedInteractiveEntity,
  mockedInteractiveStore,
  mockedSceneEntity,
  mockedSceneStore,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionSceneExit,
  actionSkillAthleticism,
} from '../../../tests/fakes';

describe('NarrativeService', () => {
  let service: NarrativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SceneStore,
          useValue: instance(mockedSceneStore),
        },
      ],
    });

    setupMocks();

    when(mockedSceneStore.initial).thenReturn('scene1');

    when(mockedSceneStore.scenes).thenReturn({
      scene1: instance(mockedSceneEntity),
      scene2: instance(mockedSceneEntity),
    });

    when(mockedInteractiveStore.interactives).thenReturn({
      sceneExitDoor: instance(mockedInteractiveEntity),
    });

    when(mockedSceneEntity.transitions).thenReturn({
      sceneExitDoor: 'scene2',
    });

    when(mockedSceneEntity.interactives).thenReturn(
      ArrayView.create([instance(mockedInteractiveEntity)])
    );

    service = TestBed.inject(NarrativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('changeScene', () => {
    describe('when a SCENE is received', () => {
      it('change the current scene', (done) => {
        let result: SceneDefinition | undefined;

        service.sceneChanged$.subscribe((scene) => {
          result = scene;
        });

        service.changeScene(actionableEvent(actionSceneExit, 'sceneExitDoor'));

        done();

        expect(result).toEqual(instance(mockedSceneEntity));
      });
    });

    describe('when a NON SCENE is received', () => {
      it('throw INVALID OPERATION', () => {
        expect(() => service.changeScene(eventSkillAthleticism)).toThrowError(
          GameStringsStore.errorMessages['INVALID-OPERATION']
        );
      });
    });
  });
});

const eventSkillAthleticism = actionableEvent(
  actionSkillAthleticism,
  'athleticism'
);
