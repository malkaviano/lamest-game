import { TestBed } from '@angular/core/testing';

import { instance, mock, reset, when } from 'ts-mockito';

import { RollDefinition } from '../definitions/roll.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { ResultLiteral } from '../literals/result.literal';
import { RandomIntService } from '../services/random-int.service';
import { RollService } from './roll.service';

describe('RollService', () => {
  let service: RollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RandomIntService,
          useValue: instance(mockedRngService),
        },
      ],
    });

    reset(mockedActor);

    when(mockedActor.skills).thenReturn({ 'Craft (Leatherworking)': 50 });

    service = TestBed.inject(RollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('actorSkillCheck', () => {
    describe('when skill value is undefined or zero', () => {
      it('return IMPOSSIBLE and 0', () => {
        const result = service.actorSkillCheck(
          instance(mockedActor),
          'Appraise'
        );

        const expected = new RollDefinition('IMPOSSIBLE', 0);

        expect(result).toEqual(expected);
      });
    });

    describe('when skill value is defined and above zero', () => {
      [
        {
          checkResult: 'FAILURE',
          roll: 80,
        },
        {
          checkResult: 'SUCCESS',
          roll: 10,
        },
      ].forEach(({ checkResult, roll }) => {
        it(`return ${checkResult} and ${roll}`, () => {
          when(mockedRngService.getRandomInterval(1, 100)).thenReturn(roll);

          const result = service.actorSkillCheck(
            instance(mockedActor),
            'Craft (Leatherworking)'
          );

          const expected = new RollDefinition(
            checkResult as ResultLiteral,
            roll
          );

          expect(result).toEqual(expected);
        });
      });
    });
  });

  describe('roll', () => {
    it('return summed result', () => {
      when(mockedRngService.getRandomInterval(1, 100)).thenReturn(50);
      when(mockedRngService.getRandomInterval(1, 20)).thenReturn(10);
      when(mockedRngService.getRandomInterval(1, 12)).thenReturn(6);
      when(mockedRngService.getRandomInterval(1, 10)).thenReturn(5);
      when(mockedRngService.getRandomInterval(1, 8)).thenReturn(4);
      when(mockedRngService.getRandomInterval(1, 6)).thenReturn(3);
      when(mockedRngService.getRandomInterval(1, 4)).thenReturn(2);

      const result = service.roll({
        D4: 1,
        D6: 1,
        D8: 1,
        D10: 1,
        D12: 1,
        D20: 1,
        D100: 1,
      });

      expect(result).toEqual(80);
    });
  });
});

const mockedRngService = mock(RandomIntService);

const mockedActor = mock<ActorInterface>();
