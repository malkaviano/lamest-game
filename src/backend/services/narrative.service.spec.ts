import { instance, when } from 'ts-mockito';

import { NarrativeService } from '@services/narrative.service';
import { GameStringsStore } from '@stores/game-strings.store';
import { ArrayView } from '@wrappers/array.view';

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
      ArrayView.create(instance(mockedInteractiveEntity))
    );

    service = new NarrativeService(instance(mockedSceneStore));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('changeScene', () => {
    describe('when a SCENE is received', () => {
      it('change the current scene', (done) => {
        let result = 0;

        service.sceneChanged$.subscribe(() => {
          result++;

          if (result === 2) {
            done();
          }
        });

        service.changeScene(actionableEvent(actionSceneExit, 'sceneExitDoor'));

        expect(result).toEqual(2);
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
