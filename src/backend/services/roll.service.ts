import { Observable, Subject } from 'rxjs';

import { Dice } from '@definitions/dice.definition';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { RollDefinition } from '@definitions/roll.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { LoggerInterface } from '@interfaces/logger.interface';
import { DiceLiteral } from '@literals/dice.literal';
import { GameStringsStore } from '@stores/game-strings.store';
import { RandomIntHelper } from '@helpers/random-int.helper';
import { SkillStore } from '@stores/skill.store';

export class RollService implements LoggerInterface {
  private readonly diceMap: {
    readonly [key in DiceLiteral]: { min: number; max: number };
  };

  private readonly skillCheckLog: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(
    private readonly randomIntHelper: RandomIntHelper,
    private readonly skillStore: SkillStore
  ) {
    this.diceMap = {
      D4: { min: 1, max: 4 },
      D6: { min: 1, max: 6 },
      D8: { min: 1, max: 8 },
      D10: { min: 1, max: 10 },
      D12: { min: 1, max: 12 },
      D20: { min: 1, max: 20 },
      D100: { min: 1, max: 100 },
    };

    this.skillCheckLog = new Subject();

    this.logMessageProduced$ = this.skillCheckLog.asObservable();
  }

  public actorSkillCheck(
    actor: ActorInterface,
    skillName: string
  ): RollDefinition {
    const skillValue = actor.skills[skillName];

    const skill = this.skillStore.skills[skillName];

    const tries = skill.combat ? 1 : 3;

    const results = [];

    for (let n = 0; n < tries; n++) {
      results.push(this.skillCheck(skillValue));
    }

    const result = results.reduce((best, r) => {
      return best.roll < r.roll ? best : r;
    });

    const logMessage = GameStringsStore.createSkillCheckLogMessage(
      actor.name,
      skillName,
      result.roll.toString(),
      result.result
    );

    this.skillCheckLog.next(logMessage);

    return result;
  }

  public roll(roll: Dice): number {
    let acc = 0;

    for (const key in roll) {
      if (Object.prototype.hasOwnProperty.call(roll, key)) {
        const dice = key as DiceLiteral;

        const amount = roll[dice];

        for (let index = 0; index < amount; index++) {
          const { min, max } = this.diceMap[dice];

          acc += this.randomIntHelper.getRandomInterval(min, max);
        }
      }
    }

    return acc;
  }

  private skillCheck(skillValue: number): RollDefinition {
    const rolled = this.randomIntHelper.getRandomInterval(1, 100);

    const result = rolled <= skillValue ? 'SUCCESS' : 'FAILURE';

    return new RollDefinition(result, rolled);
  }
}
