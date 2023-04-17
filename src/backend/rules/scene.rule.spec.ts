import { TestBed } from '@angular/core/testing';

import { instance } from 'ts-mockito';

import { NarrativeService } from '../services/narrative.service';
import { SceneRule } from './scene.rule';
import { CheckedHelper } from '../helpers/checked.helper';
import { LogMessageDefinition } from '../definitions/log-message.definition';

import {
  mockedCheckedHelper,
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
import { ruleScenario } from '../../../tests/scenarios';

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
          provide: CheckedHelper,
          useValue: instance(mockedCheckedHelper),
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
    it('should log scene changed', (done) => {
      ruleScenario(
        service,
        actor,
        eventSceneExit,
        extras,
        [sceneChangedLog],
        done
      );
    });
  });
});

const eventSceneExit = actionableEvent(actionSceneExit, interactiveInfo.id);

const sceneChangedLog = new LogMessageDefinition(
  'SCENE',
  playerInfo.name,
  'selected Exit from test'
);

const actor = instance(mockedPlayerEntity);

const extras = { target: instance(mockedInteractiveEntity) };
