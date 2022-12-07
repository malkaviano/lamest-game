import { TestBed } from '@angular/core/testing';

import { instance, verify } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { createSceneLogMessage } from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { NarrativeService } from '../services/narrative.service';
import { SceneRule } from './scene.rule';

import {
  mockedInteractiveEntity,
  mockedNarrativeService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';

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

const action = createActionableDefinition('SCENE', 'exit', 'Exit');

const event = new ActionableEvent(action, 'id1');

const log = createSceneLogMessage('player', 'test', 'Exit');
