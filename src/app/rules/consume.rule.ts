import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
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
import { EffectReceivedDefinition } from '../definitions/effect-received.definition';

@Injectable({
  providedIn: 'root',
})
export class ConsumeRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rollRule: RollService
  ) {}

  public execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

    const { actionableDefinition, eventId } = event;

    const consumable = this.inventoryService.take(actor.name, eventId);

    if (!(consumable instanceof ConsumableDefinition)) {
      throw new Error(errorMessages['WRONG-ITEM']);
    }

    const amount = consumable.amount;

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
        effect: new EffectReceivedDefinition(consumable.effect, amount),
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
