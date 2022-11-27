import { TestBed } from '@angular/core/testing';

import { instance, mock, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';
import { SimpleState } from '../states/simple.state';
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
        {
          provide: LoggingService,
          useValue: instance(mockedLoggingService),
        },
      ],
    });

    when(mockedNarrativeService.interatives).thenReturn(interactives);

    service = TestBed.inject(SceneRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should call change scene', () => {
      let result: string[] = [];

      when(mockedNarrativeService.changeScene(event)).thenCall(() =>
        result.push('ok')
      );

      when(mockedLoggingService.log('selected: test -> Exit')).thenCall(() =>
        result.push('ok')
      );

      service.execute(event);

      expect(result).toEqual(['ok', 'ok']);
    });
  });
});

const mockedNarrativeService = mock(NarrativeService);
const mockedLoggingService = mock(LoggingService);

const action = createActionableDefinition('SCENE', 'exit', 'Exit');

const event = new ActionableEvent(action, 'i1');

const interactives: KeyValueInterface<InteractiveEntity> = {
  i1: new InteractiveEntity('i1', 'test', 'test', new SimpleState([action])),
};
