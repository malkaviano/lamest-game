import { TestBed } from '@angular/core/testing';

import { take } from 'rxjs';
import { instance, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { SceneDefinition } from '../definitions/scene.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { SceneEntity } from '../entities/scene.entity';
import { ActionableEvent } from '../events/actionable.event';
import { SimpleState } from '../states/simple.state';
import { SceneStore } from '../stores/scene.store';
import { ArrayView } from '../views/array.view';
import { NarrativeService } from './narrative.service';
import { InventoryService } from './inventory.service';
import { ItemStore } from '../stores/item.store';

import {
  mockedInteractiveStore,
  mockedInventoryService,
  mockedItemStore,
  mockedSceneStore,
} from '../../../tests/mocks';

describe('NarrativeService', () => {
  let service: NarrativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SceneStore,
          useValue: instance(mockedSceneStore),
        },
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: ItemStore,
          useValue: instance(mockedItemStore),
        },
      ],
    });

    when(mockedSceneStore.scenes).thenReturn({
      scene1: entity1,
      scene2: entity2,
    });

    when(mockedInteractiveStore.interactives).thenReturn({
      sceneExitDoor: sceneInteractive,
    });

    service = TestBed.inject(NarrativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('changeScene', () => {
    describe('when a SCENE is received', () => {
      it('change the current scene', (done) => {
        let result: SceneDefinition | undefined;

        service.sceneChanged$.pipe(take(10)).subscribe((scene) => {
          result = scene;
        });

        service.changeScene(new ActionableEvent(exitDoor, 'sceneExitDoor'));

        done();

        expect(result).toEqual(entity2);
      });
    });

    describe('when a NON SCENE is received', () => {
      it('throw INVALID OPERATION', () => {
        expect(() =>
          service.changeScene(new ActionableEvent(skill, 'athleticism'))
        ).toThrowError(errorMessages['INVALID-OPERATION']);
      });
    });
  });

  describe('interatives', () => {
    it('return interactives from current scene', () => {
      const result = service.interatives;

      expect(result).toEqual({
        sceneExitDoor: sceneInteractive,
        athleticism: skillInteractive,
      });
    });
  });
});

const exitDoor = createActionableDefinition('SCENE', 'exit', 'Exit');

const skill = createActionableDefinition('SKILL', 'athleticism', 'Athleticism');

const sceneInteractive = new InteractiveEntity(
  'sceneExitDoor',
  'exit',
  'leaving',
  new SimpleState(new ArrayView([exitDoor]))
);

const skillInteractive = new InteractiveEntity(
  'athleticism',
  'Jumping',
  'Jump outside the window',
  new SimpleState(new ArrayView([skill]))
);

const entity1 = new SceneEntity(
  new ArrayView([]),
  new ArrayView([sceneInteractive, skillInteractive]),
  {
    sceneExitDoor: 'scene2',
  }
);

const entity2 = new SceneEntity(new ArrayView([]), new ArrayView([]), {});
