import { Injectable } from '@angular/core';
import { ActionableEvent } from '../events/actionable.event';

import { RuleInterface } from '../interfaces/rule.interface';
import { LoggingService } from '../services/logging.service';
import { NarrativeService } from '../services/narrative.service';
import { RandomIntService } from '../services/random-int.service';

@Injectable({
  providedIn: 'root',
})
export class DefenseRule implements RuleInterface {
  constructor(
    private readonly rngService: RandomIntService,
    private readonly narrativeService: NarrativeService,
    private readonly loggingService: LoggingService
  ) {}

  public execute(action: ActionableEvent): void {
    Object.entries(this.narrativeService.interatives).forEach(
      ([_, interactive]) => {
        const damage = interactive.damagePlayer(action);

        if (damage) {
          const damageAmount =
            this.rngService.roll(damage.diceRoll) + damage.fixed;

          this.loggingService.log(
            `${interactive.name} did ${damageAmount} damage to Player`
          );
        }
      }
    );
  }
}
