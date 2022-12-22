import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { RollService } from '../services/roll.service';
import { SkillRule } from './skill.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { RollDefinition } from '../definitions/roll.definition';

import {
  mockedPlayerEntity,
  mockedInteractiveEntity,
  mockedRollService,
  setupMocks,
  mockedExtractorHelper,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionSkillSurvival,
  interactiveInfo,
  playerInfo,
} from '../../../tests/fakes';
import { ruleScenario } from '../../../tests/scenarios';

describe('SkillRule', () => {
  let service: SkillRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RollService,
          useValue: instance(mockedRollService),
        },
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
      ],
    });

    setupMocks();

    when(
      mockedInteractiveEntity.reactTo(
        actionSkillSurvival,
        'SUCCESS',
        deepEqual({
          actorVisibility: actor,
          target,
        })
      )
    ).thenReturn(reactToMessage);

    service = TestBed.inject(SkillRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should log skill check result', () => {
      when(
        mockedRollService.actorSkillCheck(
          actor,
          eventSkillSurvival.actionableDefinition.name
        )
      ).thenReturn(new RollDefinition('SUCCESS', 10));

      ruleScenario(service, actor, eventSkillSurvival, extras, [
        skillCheckLog,
        reactedLog,
      ]);
    });

    describe('when skill value was zero', () => {
      it('should log cannot check skill', () => {
        when(
          mockedRollService.actorSkillCheck(
            actor,
            eventSkillSurvival.actionableDefinition.name
          )
        ).thenReturn(new RollDefinition('IMPOSSIBLE', 0));

        ruleScenario(service, actor, eventSkillSurvival, extras, [
          impossibleLog,
        ]);
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const target = instance(mockedInteractiveEntity);

const extras = {
  actorVisibility: actor,
  target,
};

const eventSkillSurvival = actionableEvent(
  actionSkillSurvival,
  interactiveInfo.id
);

const skillCheckLog = new LogMessageDefinition(
  'CHECK',
  playerInfo.name,
  'Survival skill checked and rolled 10, it was a SUCCESS'
);

const impossibleLog = new LogMessageDefinition(
  'CHECK',
  playerInfo.name,
  "Survival skill couldn't be checked because it's value is zero"
);

const reactToMessage = 'survival success';

const reactedLog = new LogMessageDefinition(
  'CHECK',
  interactiveInfo.name,
  reactToMessage
);
