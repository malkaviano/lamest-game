import { TestBed } from '@angular/core/testing';
import { last, take } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { SceneEntity } from '../entities/scene.entity';
import { ActionableEvent } from '../events/actionable.event';
import { SimpleState } from '../states/simple.state';
import { InteractiveStore } from '../stores/interactive.store';
import { SceneStore } from '../stores/scene.store';
import { ArrayView } from '../views/array.view';

import { SceneManagerService } from './scene-manager.service';

describe('SceneManagerService', () => {
  let service: SceneManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SceneStore,
          useValue: instance(mockedSceneStore),
        },
      ],
    });

    when(mockedSceneStore.scenes).thenReturn({
      scene1: entity1,
      scene2: entity2,
    });

    when(mockedSceneStore.interactiveStore).thenReturn(
      instance(mockedInteractiveStore)
    );

    when(mockedInteractiveStore.interactives).thenReturn({
      sceneExitDoor: sceneInteractive,
    });

    service = TestBed.inject(SceneManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Action received', () => {
    describe('when a SCENE is received', () => {
      it('change the current scene', (done) => {
        service.sceneChanged$.pipe(take(2), last()).subscribe((scene) => {
          expect(scene).toEqual(entity2);
        });

        service.run(new ActionableEvent(exitDoor, 'sceneExitDoor'), 'NONE');

        done();
      });

      it('return scene trigger interactive', () => {
        const result = service.run(
          new ActionableEvent(exitDoor, 'sceneExitDoor'),
          'NONE'
        );

        expect(result).toEqual(sceneInteractive);
      });
    });

    describe('when a NON SCENE is received', () => {
      it('return interactive with state change', () => {
        const result = service.run(
          new ActionableEvent(skill, 'athleticism'),
          'SUCCESS'
        );

        expect(result.id).toEqual('athleticism');
      });
    });
  });
});

const mockedSceneStore = mock(SceneStore);

const mockedInteractiveStore = mock(InteractiveStore);

const exitDoor = createActionableDefinition('SCENE', 'exit', 'Exit');

const skill = createActionableDefinition('SKILL', 'athleticism', 'Athleticism');

const sceneInteractive = new InteractiveEntity(
  'sceneExitDoor',
  'exit',
  'leaving',
  new SimpleState([exitDoor])
);

const skillInteractive = new InteractiveEntity(
  'athleticism',
  'Jumping',
  'Jump outside the window',
  new SimpleState([skill])
);

const entity1 = new SceneEntity(
  new ArrayView([]),
  new ArrayView([sceneInteractive, skillInteractive]),
  {
    sceneExitDoor: 'scene2',
  }
);

const entity2 = new SceneEntity(new ArrayView([]), new ArrayView([]), {});
