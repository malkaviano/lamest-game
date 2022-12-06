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
import { RollDefinition } from '../definitions/roll.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { CharacterEntity } from '../entities/character.entity';
import { HitPointsEvent } from '../events/hitpoints.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import { DefenseRule } from './defense.rule';
import { RollService } from '../services/roll.service';
import { NpcEntity } from '../entities/npc.entity';

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
          provide: RollService,
          useValue: instance(mockedRollRule),
        },
      ],
    });

    reset(mockedRollRule);

    when(mockedCharacterService.currentCharacter).thenReturn(
      instance(mockedCharacterEntity)
    );

    when(mockedNarrativeService.interatives).thenReturn(interactives);

    when(mockedActorEntity.id).thenReturn('id1');

    when(mockedActorEntity.name).thenReturn('test');

    when(mockedActorEntity.attack).thenReturn({
      skillValue: 45,
      weapon,
    });

    Object.setPrototypeOf(instance(mockedActorEntity), NpcEntity.prototype);

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
            when(
              mockedRollRule.actorSkillCheck(
                instance(mockedCharacterEntity),
                'Dodge'
              )
            ).thenReturn(new RollDefinition('SUCCESS', 10));

            when(mockedRollRule.skillCheck(45)).thenReturn(
              new RollDefinition('SUCCESS', 10)
            );

            const result = service.execute();

            expect(result).toEqual({
              logs: [logAttacked1, logDodged],
            });
          });
        });

        describe('when dodge fails', () => {
          it('return logs', () => {
            when(
              mockedRollRule.actorSkillCheck(
                instance(mockedCharacterEntity),
                'Dodge'
              )
            ).thenReturn(new RollDefinition('FAILURE', 90));

            when(mockedRollRule.skillCheck(45)).thenReturn(
              new RollDefinition('SUCCESS', 10)
            );

            when(mockedCharacterEntity.damaged(4)).thenReturn(
              new HitPointsEvent(10, 6)
            );

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
        when(mockedRollRule.skillCheck(45)).thenReturn({
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

const mockedRollRule = mock(RollService);

const mockedNarrativeService = mock(NarrativeService);

const mockedActorEntity = mock(NpcEntity);

const interactives: KeyValueInterface<NpcEntity> = {
  id1: instance(mockedActorEntity),
};

const mockedCharacterEntity = mock(CharacterEntity);

const logMissed = createMissedAttackLogMessage('test', 'player');

const logDodged = createDodgedLogMessage('player', 'test');

const logAttacked1 = createAttackedLogMessage('test', 'player', 'claw');

const logAttacked2 = createFreeLogMessage('player', createDamagedMessage(4));

const weapon = new WeaponDefinition(
  'gg',
  'claw',
  '',
  'Brawl',
  new DamageDefinition(createDice(), 4),
  true,
  'PERMANENT'
);
