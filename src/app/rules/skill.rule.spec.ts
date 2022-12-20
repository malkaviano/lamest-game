import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { RollService } from '../services/roll.service';
import { SkillRule } from './skill.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

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
  actionSkillBrawl,
  interactiveInfo,
  playerInfo,
} from '../../../tests/fakes';
import { LogMessageDefinition } from '../definitions/log-message.definition';

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
      mockedStringMessagesStoreService.createSkillCheckLogMessage(
        playerInfo.name,
        'Brawl',
        '10',
        'SUCCESS'
      )
    ).thenReturn(log1);

    when(
      mockedStringMessagesStoreService.createCannotCheckSkillLogMessage(
        playerInfo.name,
        'Brawl'
      )
    ).thenReturn(log2);

    when(
      mockedStringMessagesStoreService.createFreeLogMessage(
        'CHECK',
        interactiveInfo.name,
        'destroyed by xpto'
      )
    ).thenReturn(log3);

    when(
      mockedInteractiveEntity.reactTo(
        actionSkillBrawl,
        'SUCCESS',
        deepEqual({ actorVisibility: instance(mockedPlayerEntity) })
      )
    ).thenReturn('destroyed by xpto');

    service = TestBed.inject(SkillRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when skill has no value', () => {
      it('return skill cannot be checked', () => {
        when(mockedPlayerEntity.skills).thenReturn({});

        when(
          mockedRollService.actorSkillCheck(
            instance(mockedPlayerEntity),
            'Brawl'
          )
        ).thenReturn({
          result: 'IMPOSSIBLE',
          roll: 0,
        });

        const result = service.execute(
          instance(mockedPlayerEntity),
          eventSkillBrawl,
          { target: instance(mockedInteractiveEntity) }
        );

        expect(result).toEqual({
          logs: [log2],
        });
      });
    });

    it('return logs', () => {
      when(mockedPlayerEntity.skills).thenReturn({ Brawl: 45 });

      when(
        mockedRollService.actorSkillCheck(instance(mockedPlayerEntity), 'Brawl')
      ).thenReturn({
        result: 'SUCCESS',
        roll: 10,
      });

      const result = service.execute(
        instance(mockedPlayerEntity),
        eventSkillBrawl,
        { target: instance(mockedInteractiveEntity) }
      );

      expect(result).toEqual({
        logs: [log1, log3],
      });
    });
  });
});

const eventSkillBrawl = actionableEvent(actionSkillBrawl, interactiveInfo.id);

const log1 = new LogMessageDefinition(
  'CHECK',
  playerInfo.name,
  'Brawl-SUCCESS-10'
);

const log2 = new LogMessageDefinition('CHECK', playerInfo.name, 'NOP-Brawl');

const log3 = new LogMessageDefinition(
  'ATTACKED',
  interactiveInfo.name,
  'destroyed by xpto'
);
