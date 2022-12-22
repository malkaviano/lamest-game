import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { RollService } from '../services/roll.service';
import { SkillRule } from './skill.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { GameMessagesStoreService } from '../stores/game-messages.store.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { RollDefinition } from '../definitions/roll.definition';

import {
  mockedPlayerEntity,
  mockedInteractiveEntity,
  mockedRollService,
  setupMocks,
  mockedExtractorHelper,
  mockedStringMessagesStoreService,
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
        {
          provide: GameMessagesStoreService,
          useValue: instance(mockedStringMessagesStoreService),
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

      when(
        mockedStringMessagesStoreService.createSkillCheckLogMessage(
          playerInfo.name,
          eventSkillSurvival.actionableDefinition.name,
          '10',
          'SUCCESS'
        )
      ).thenReturn(skillCheckLog);

      when(
        mockedStringMessagesStoreService.createFreeLogMessage(
          'CHECK',
          interactiveInfo.name,
          reactToMessage
        )
      ).thenReturn(reactedLog);

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

        when(
          mockedStringMessagesStoreService.createCannotCheckSkillLogMessage(
            playerInfo.name,
            eventSkillSurvival.actionableDefinition.name
          )
        ).thenReturn(impossibleLog);

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
  'Survival-SUCCESS-10'
);

const impossibleLog = new LogMessageDefinition(
  'CHECK',
  playerInfo.name,
  'NOP-Survival'
);

const reactToMessage = 'survival success';

const reactedLog = new LogMessageDefinition(
  'ATTACKED',
  interactiveInfo.name,
  reactToMessage
);
