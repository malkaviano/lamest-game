import { TestBed } from '@angular/core/testing';

import { instance, verify, when } from 'ts-mockito';

import { NarrativeService } from '../services/narrative.service';
import { SceneRule } from './scene.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';

import {
  mockedExtractorHelper,
  mockedInteractiveEntity,
  mockedNarrativeService,
  mockedPlayerEntity,
  mockedStringMessagesStoreService,
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
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
        {
          provide: StringMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
        },
      ],
    });

    setupMocks();

    when(
      mockedStringMessagesStoreService.createSceneLogMessage(
        playerInfo.name,
        interactiveInfo.name,
        'Exit'
      )
    ).thenReturn(log);

    service = TestBed.inject(SceneRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('return logs', () => {
      const result = service.execute(instance(mockedPlayerEntity), event, {
        target: instance(mockedInteractiveEntity),
      });

      verify(mockedNarrativeService.changeScene(event)).once();

      expect(result).toEqual({
        logs: [log],
      });
    });
  });
});

const event = actionableEvent(actionSceneExit, interactiveInfo.id);

const log = new LogMessageDefinition('SCENE', playerInfo.name, 'Exit');
