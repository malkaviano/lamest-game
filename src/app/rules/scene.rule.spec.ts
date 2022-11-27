import { TestBed } from '@angular/core/testing';

import { instance, mock, verify, when } from 'ts-mockito';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { InteractiveEntity } from '../entities/interactive.entity';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';
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

    when(mockedNarrativeService.interatives).thenReturn(interactives);

    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    service = TestBed.inject(SceneRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should call change scene', () => {
      const result = service.execute(event);

      verify(mockedNarrativeService.changeScene(event)).once();

      expect(result).toEqual({
        logs: ['selected: test -> Exit'],
      });
    });
  });
});

const mockedNarrativeService = mock(NarrativeService);

const action = createActionableDefinition('SCENE', 'exit', 'Exit');

const event = new ActionableEvent(action, 'id1');

const mockedInteractiveEntity = mock(InteractiveEntity);

const interactives: KeyValueInterface<InteractiveEntity> = {
  id1: instance(mockedInteractiveEntity),
};
