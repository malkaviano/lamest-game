import { instance, when } from 'ts-mockito';

import { RollDefinition } from '@definitions/roll.definition';
import { RpgService } from '@services/rpg.service';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { CheckResultLiteral } from '@literals/check-result.literal';

import {
  mockedActorEntity,
  mockedGamePredicate,
  mockedRandomIntHelper,
  mockedSkillStore,
  setupMocks,
} from '../../../tests/mocks';
import {
  fakeCharacteristics,
  fakeSkillStore,
  glock,
  simpleSword,
} from '../../../tests/fakes';

describe('RpgService', () => {
  const service = new RpgService(
    instance(mockedRandomIntHelper),
    instance(mockedSkillStore)
  );

  beforeEach(() => {
    setupMocks();

    when(mockedSkillStore.skills).thenReturn(fakeSkillStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('actorSkillCheck', () => {
    describe('when skill value is above zero', () => {
      [
        {
          skillName: 'Melee Weapon (Simple)',
          checkResult: 'FAILURE',
          rolls: [80],
          message:
            'Melee Weapon (Simple) skill checked and rolled 80, it was a FAILURE',
          roll: 80,
        },
        {
          skillName: 'Melee Weapon (Simple)',
          checkResult: 'SUCCESS',
          rolls: [10],
          message:
            'Melee Weapon (Simple) skill checked and rolled 10, it was a SUCCESS',
          roll: 10,
        },

        {
          skillName: 'First Aid',
          checkResult: 'SUCCESS',
          rolls: [80, 5, 55],
          message: 'First Aid skill checked and rolled 5, it was a SUCCESS',
          roll: 5,
        },
      ].forEach(({ skillName, checkResult, rolls, message, roll }) => {
        it(`return ${checkResult} and ${roll}`, () => {
          const actor = instance(mockedActorEntity);

          when(mockedRandomIntHelper.getRandomInterval(1, 100))
            .thenReturn(rolls[0])
            .thenReturn(rolls[1])
            .thenReturn(rolls[2]);

          when(mockedGamePredicate.canUseSkill(actor, skillName)).thenReturn(
            true
          );

          const result = service.actorSkillCheck(actor, skillName);

          const expected = new RollDefinition(
            checkResult as CheckResultLiteral,
            roll
          );

          expect(result).toEqual(expected);
        });

        it('should emit skillCheckLog log', (done) => {
          let result: LogMessageDefinition | undefined;

          const actor = instance(mockedActorEntity);

          when(
            mockedGamePredicate.canUseSkill(actor, 'Melee Weapon (Simple)')
          ).thenReturn(true);

          service.logMessageProduced$.subscribe((event) => {
            result = event;
          });

          when(mockedRandomIntHelper.getRandomInterval(1, 100)).thenReturn(
            roll
          );

          service.actorSkillCheck(instance(mockedActorEntity), skillName);

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

  describe('weaponDamage', () => {
    [
      {
        weapon: simpleSword,
        expected: 4,
      },
      {
        weapon: glock,
        expected: 2,
      },
    ].forEach(({ weapon, expected }) => {
      it('returns weapon damage plus str bonus', () => {
        const result = service.weaponDamage(weapon, fakeCharacteristics);

        expect(result).toEqual(expected);
      });
    });
  });
});
