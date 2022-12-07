import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, mock, reset, when } from 'ts-mockito';

import { DamageDefinition } from '../definitions/damage.definition';
import { createDice } from '../definitions/dice.definition';
import {
  createAttackedLogMessage,
  createDamagedMessage,
  createFreeLogMessage,
  createMissedAttackLogMessage,
} from '../definitions/log-message.definition';
import { RollDefinition } from '../definitions/roll.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { PlayerEntity } from '../entities/player.entity';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { CharacterService } from '../services/character.service';
import { NarrativeService } from '../services/narrative.service';
import { CombatRule } from './combat.rule';
import { RollService } from '../services/roll.service';
import { ActorEntity } from '../entities/actor.entity';
import { createActionableDefinition } from '../definitions/actionable.definition';

describe('CombatRule', () => {
  let service: CombatRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RollService,
          useValue: instance(mockedRollService),
        },
      ],
    });

    reset(mockedRollService);

    service = TestBed.inject(CombatRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

const mockedRollService = mock(RollService);
