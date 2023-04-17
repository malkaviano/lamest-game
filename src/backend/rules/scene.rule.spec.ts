import { instance } from 'ts-mockito';

import { SceneRule } from './scene.rule';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';

import {
  mockedCheckedService,
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
  const rule = new SceneRule(
    instance(mockedNarrativeService),
    instance(mockedCheckedService)
  );

  beforeEach(() => {
    setupMocks();
  });

  it('should be created', () => {
    expect(rule).toBeTruthy();
  });

  describe('execute', () => {
    it('should log scene changed', (done) => {
      ruleScenario(
        rule,
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
