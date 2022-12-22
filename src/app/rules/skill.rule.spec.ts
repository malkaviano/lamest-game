import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';
import { take } from 'rxjs';

import { RollService } from '../services/roll.service';
import { SkillRule } from './skill.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { MasterRuleService } from './master.rule.service';
import { ActionableEvent } from '../events/actionable.event';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ActorInterface } from '../interfaces/actor.interface';
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
          provide: StringMessagesStoreService,
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

      scenario(service, actor, eventSkillSurvival, extra, [
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

        scenario(service, actor, eventSkillSurvival, extra, [impossibleLog]);
      });
    });
  });
});

const actor = instance(mockedPlayerEntity);

const target = instance(mockedInteractiveEntity);

const extra = {
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

function scenario(
  service: MasterRuleService,
  actor: ActorInterface,
  actionableEvent: ActionableEvent,
  extras: RuleExtrasInterface,
  expected: LogMessageDefinition[]
) {
  const result: LogMessageDefinition[] = [];

  service.ruleLog$.pipe(take(100)).subscribe((event) => {
    result.push(event);
  });

  service.execute(actor, actionableEvent, extras);

  expect(result).toEqual(expected);
}
