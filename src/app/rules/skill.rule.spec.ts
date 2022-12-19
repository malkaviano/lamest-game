import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createFreeLogMessage,
} from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import { SkillRule } from './skill.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';

import {
  mockedPlayerEntity,
  mockedInteractiveEntity,
  mockedRollService,
  setupMocks,
  mockedExtractorHelper,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionSkillBrawl,
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
      ],
    });

    setupMocks();

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

const log1 = createCheckLogMessage(playerInfo.name, 'Brawl', 10, 'SUCCESS');

const log2 = createCannotCheckLogMessage(playerInfo.name, 'Brawl');

const log3 = createFreeLogMessage(interactiveInfo.name, 'destroyed by xpto');
