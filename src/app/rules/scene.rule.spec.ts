import { TestBed } from '@angular/core/testing';

import { instance, verify } from 'ts-mockito';

import { createSceneLogMessage } from '../definitions/log-message.definition';
import { NarrativeService } from '../services/narrative.service';
import { SceneRule } from './scene.rule';

import {
  mockedInteractiveEntity,
  mockedNarrativeService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionSceneExit,
  interactiveInfo,
  playerInfo,
} from '../../../tests/fakes';

describe('SceneRule', () => {
  let service: SceneRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NarrativeService,
          useValue: instance(mockedNarrativeService),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(SceneRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      const result = service.execute(
        instance(mockedPlayerEntity),
        event,
        instance(mockedInteractiveEntity)
      );

      verify(mockedNarrativeService.changeScene(event)).once();

      expect(result).toEqual({
        logs: [log],
      });
    });
  });
});

const event = actionableEvent(actionSceneExit, interactiveInfo.id);

const log = createSceneLogMessage(
  playerInfo.name,
  interactiveInfo.name,
  'Exit'
);
