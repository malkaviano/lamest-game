import { TestBed } from '@angular/core/testing';

import { instance, mock, verify, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { createSceneLogMessage } from '../definitions/log-message.definition';
import { PlayerEntity } from '../entities/player.entity';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { NarrativeService } from '../services/narrative.service';
import { SceneRule } from './scene.rule';

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

    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    service = TestBed.inject(SceneRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      const result = service.execute(
        instance(mockedCharacterEntity),
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

const mockedNarrativeService = mock(NarrativeService);

const action = createActionableDefinition('SCENE', 'exit', 'Exit');

const event = new ActionableEvent(action, 'id1');

const mockedInteractiveEntity = mock(InteractiveEntity);

const mockedCharacterEntity = mock(PlayerEntity);

const log = createSceneLogMessage('player', 'test', 'Exit');
