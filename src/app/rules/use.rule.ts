import { Injectable } from '@angular/core';
import { errorMessages } from '../definitions/error-messages.definition';
import {
  createFreeLogMessage,
  createLostLogMessage,
  createNotFoundLogMessage,
} from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ExtractorHelper } from '../helpers/extractor-target.helper';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { RuleInterface } from '../interfaces/rule.interface';
import { InventoryService } from '../services/inventory.service';

@Injectable({
  providedIn: 'root',
})
export class UseRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly withTarget: ExtractorHelper
  ) {}

  execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.withTarget.extractRuleTarget(extras);

    const { actionableDefinition } = event;

    const { items } = this.inventoryService.check(actor.id);

    const item = items.find(
      (i) => i.item.identity.name === actionableDefinition.name
    );

    if (!item) {
      return {
        logs: [
          createNotFoundLogMessage(actor.name, actionableDefinition.label),
        ],
      };
    }

    if (item.item.category !== 'USABLE') {
      throw new Error(errorMessages['WRONG-ITEM']);
    }

    const logs = [];

    const usable = this.inventoryService.take(
      actor.id,
      actionableDefinition.name
    );

    const log = target.reactTo(actionableDefinition, 'USED', { item: usable });

    if (log) {
      logs.push(createFreeLogMessage(target.name, log));
    }

    logs.push(createLostLogMessage(actor.name, usable.identity.label));

    return {
      logs,
    };
  }
}
