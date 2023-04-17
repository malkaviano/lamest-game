import { instance, when } from 'ts-mockito';

import { RollDefinition } from '../../core/definitions/roll.definition';
import { ResultLiteral } from '../../core/literals/result.literal';
import { RollService } from './roll.service';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';

import {
  mockedActorEntity,
  mockedRandomIntHelper,
  setupMocks,
} from '../../../tests/mocks';

describe('RollService', () => {
  const service = new RollService(instance(mockedRandomIntHelper));

  beforeEach(() => {
    setupMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('actorSkillCheck', () => {
    describe('when skill value is not set or zero', () => {
      it('return IMPOSSIBLE and 0', () => {
        const result = service.actorSkillCheck(
          instance(mockedActorEntity),
          'Appraise'
        );

        const expected = new RollDefinition('IMPOSSIBLE', 0);

        expect(result).toEqual(expected);
      });

      it('should emit skillCheckLog log', (done) => {
        let result: LogMessageDefinition | undefined;

        service.logMessageProduced$.subscribe((event) => {
          result = event;
        });

        const actor = instance(mockedActorEntity);

        service.actorSkillCheck(actor, 'Appraise');

        const expected = new LogMessageDefinition(
          'CHECK',
          actor.name,
          "Appraise skill couldn't be checked because it's value is zero"
        );

        done();

        expect(result).toEqual(expected);
      });
    });

    describe('when skill value is above zero', () => {
      [
        {
          checkResult: 'FAILURE',
          roll: 80,
          message:
            'Melee Weapon (Simple) skill checked and rolled 80, it was a FAILURE',
        },
        {
          checkResult: 'SUCCESS',
          roll: 10,
          message:
            'Melee Weapon (Simple) skill checked and rolled 10, it was a SUCCESS',
        },
      ].forEach(({ checkResult, roll, message }) => {
        it(`return ${checkResult} and ${roll}`, () => {
          when(mockedRandomIntHelper.getRandomInterval(1, 100)).thenReturn(
            roll
          );

          const result = service.actorSkillCheck(
            instance(mockedActorEntity),
            'Melee Weapon (Simple)'
          );

          const expected = new RollDefinition(
            checkResult as ResultLiteral,
            roll
          );

          expect(result).toEqual(expected);
        });

        it('should emit skillCheckLog log', (done) => {
          let result: LogMessageDefinition | undefined;

          service.logMessageProduced$.subscribe((event) => {
            result = event;
          });

          const actor = instance(mockedActorEntity);

          when(mockedRandomIntHelper.getRandomInterval(1, 100)).thenReturn(
            roll
          );

          service.actorSkillCheck(
            instance(mockedActorEntity),
            'Melee Weapon (Simple)'
          );

          const expected = new LogMessageDefinition(
            'CHECK',
            actor.name,
            message
          );

          done();

          expect(result).toEqual(expected);
        });
      });
    });
  });

  describe('roll', () => {
    it('return summed result', () => {
      when(mockedRandomIntHelper.getRandomInterval(1, 100)).thenReturn(50);
      when(mockedRandomIntHelper.getRandomInterval(1, 20)).thenReturn(10);
      when(mockedRandomIntHelper.getRandomInterval(1, 12)).thenReturn(6);
      when(mockedRandomIntHelper.getRandomInterval(1, 10)).thenReturn(5);
      when(mockedRandomIntHelper.getRandomInterval(1, 8)).thenReturn(4);
      when(mockedRandomIntHelper.getRandomInterval(1, 6)).thenReturn(3);
      when(mockedRandomIntHelper.getRandomInterval(1, 4)).thenReturn(2);

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
