import { instance } from 'ts-mockito';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { SceneRule } from '@rules/scene.rule';
import { RuleResultInterface } from '@interfaces/rule-result.interface';

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
  let rule: SceneRule;

  beforeEach(() => {
    setupMocks();

    rule = new SceneRule(
      instance(mockedNarrativeService),
      instance(mockedCheckedService)
    );
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

    it('return transitioned result', () => {
      const result = rule.execute(actor, eventSceneExit, extras);

      const expected: RuleResultInterface = {
        name: 'SCENE',
        event: eventSceneExit,
        actor,
        target: extras.target,
        result: 'EXECUTED',
      };

      expect(result).toEqual(expected);
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
