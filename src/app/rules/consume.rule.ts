import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import {
  createCannotCheckLogMessage,
  createCheckLogMessage,
  createConsumedLogMessage,
  createFreeLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { RollService } from '../services/roll.service';
import { RollDefinition } from '../definitions/roll.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { EffectEvent } from '../events/effect.event';
import { ExtractorHelper } from '../helpers/extractor.helper';

@Injectable({
  providedIn: 'root',
})
export class ConsumeRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rollRule: RollService,
    private readonly extractorHelper: ExtractorHelper
  ) {}

  public execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const { actionableDefinition, eventId } = event;

    const consumable =
      this.extractorHelper.extractItemOrThrow<ConsumableDefinition>(
        this.inventoryService,
        actor.id,
        eventId
      );

    const hp = consumable.hp;

    const energy = consumable.energy;

    let rollDefinition: RollDefinition = new RollDefinition('NONE', 0);

    if (consumable.skillName) {
      rollDefinition = this.rollRule.actorSkillCheck(
        actor,
        consumable.skillName
      );
    }

    if (rollDefinition.result !== 'IMPOSSIBLE') {
      logs.push(
        createConsumedLogMessage(actor.name, consumable.identity.label)
      );

      if (rollDefinition.result !== 'NONE' && consumable.skillName) {
        logs.push(
          createCheckLogMessage(
            actor.name,
            consumable.skillName,
            rollDefinition.roll,
            rollDefinition.result
          )
        );
      }

      const log = actor.reactTo(actionableDefinition, rollDefinition.result, {
        effect: new EffectEvent(consumable.effect, hp),
        energyGain: energy,
      });

      if (log) {
        logs.push(createFreeLogMessage(actor.name, log));
      }
    } else if (consumable.skillName) {
      logs.push(createCannotCheckLogMessage(actor.name, consumable.skillName));
    }

    return { logs };
  }
}
