import { Injectable } from '@angular/core';

import {
  createFreeLogMessage,
  createLostLogMessage,
  createNotFoundLogMessage,
} from '../definitions/log-message.definition';
import { UsableDefinition } from '../definitions/usable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ExtractorHelper } from '../helpers/extractor.helper';
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
    private readonly extractorHelper: ExtractorHelper
  ) {}

  execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const { actionableDefinition } = event;

    const item = this.inventoryService.take<UsableDefinition>(
      actor.id,
      actionableDefinition.name
    );

    if (!item) {
      return {
        logs: [
          createNotFoundLogMessage(actor.name, actionableDefinition.label),
        ],
      };
    }

    const logs = [];

    const log = target.reactTo(actionableDefinition, 'USED', { item });

    if (log) {
      logs.push(createFreeLogMessage(target.name, log));
    }

    logs.push(createLostLogMessage(actor.name, item.identity.label));

    return {
      logs,
    };
  }
}
