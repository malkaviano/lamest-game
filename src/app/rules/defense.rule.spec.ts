import { TestBed } from '@angular/core/testing';

import { instance, mock, reset, when } from 'ts-mockito';

import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import {
  createAttackedLogMessage,
  createDamagedMessage,
  createDodgedLogMessage,
  createFreeLogMessage,
  createMissedAttackLogMessage,
} from '../definitions/log-message.definition';
import { CharacterEntity } from '../entities/character.entity';
import { InteractiveEntity } from '../entities/interactive.entity';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';

import { DefenseRule } from './defense.rule';

describe('DefenseRule', () => {
  let service: DefenseRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NarrativeService,
          useValue: instance(mockedNarrativeService),
        },
        {
          provide: CharacterService,
          useValue: instance(mockedCharacterService),
        },
        {
          provide: RandomIntService,
          useValue: instance(mockedRngService),
        },
      ],
    });

    reset(mockedRngService);

    when(mockedCharacterService.currentCharacter).thenReturn(
      instance(mockedCharacterEntity)
    );

    when(mockedCharacterEntity.skills).thenReturn({ Dodge: 45 });

    when(mockedNarrativeService.interatives).thenReturn(interactives);

    when(mockedInteractiveEntity.id).thenReturn('id1');

    when(mockedInteractiveEntity.name).thenReturn('test');

    when(mockedInteractiveEntity.attack).thenReturn({
      skillValue: 45,
      damage: new DamageDefinition(createDice(), 4),
      dodgeable: true,
      weaponName: 'claw',
    });

    service = TestBed.inject(DefenseRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    describe('when attack hit', () => {
      describe('when attack is dodgeable', () => {
        describe('when player dodges', () => {
          it('return logs', () => {
            when(mockedRngService.checkSkill(45)).thenReturn({
              result: 'SUCCESS',
              roll: 10,
            });

            const result = service.execute();

            expect(result).toEqual({
              logs: [logAttacked1, logDodged],
            });
          });
        });

        describe('when dodge fails', () => {
          it('return logs', () => {
            when(mockedRngService.checkSkill(45))
              .thenReturn({
                result: 'SUCCESS',
                roll: 10,
              })
              .thenReturn({
                result: 'FAILURE',
                roll: 90,
              });

            when(mockedCharacterEntity.damaged(4)).thenReturn(4);

            const result = service.execute();

            expect(result).toEqual({
              logs: [logAttacked1, logAttacked2],
            });
          });
        });
      });
    });

    describe('when attack miss', () => {
      it('return logs', () => {
        when(mockedRngService.checkSkill(45)).thenReturn({
          result: 'FAILURE',
          roll: 100,
        });

        const result = service.execute();

        expect(result).toEqual({
          logs: [logMissed],
        });
      });
    });
  });
});

const mockedCharacterService = mock(CharacterService);

const mockedRngService = mock(RandomIntService);

const mockedNarrativeService = mock(NarrativeService);

const mockedInteractiveEntity = mock(InteractiveEntity);

const interactives: KeyValueInterface<InteractiveEntity> = {
  id1: instance(mockedInteractiveEntity),
};

const mockedCharacterEntity = mock(CharacterEntity);

const logMissed = createMissedAttackLogMessage('test', 'player');

const logDodged = createDodgedLogMessage('player', 'test');

const logAttacked1 = createAttackedLogMessage('test', 'player', 'claw');

const logAttacked2 = createFreeLogMessage('player', createDamagedMessage(4));
