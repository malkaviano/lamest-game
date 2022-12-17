import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import {
  createTookLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor-target.helper';

@Injectable({
  providedIn: 'root',
})
export class PickRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly extractorHelper: ExtractorHelper
  ) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const logs: LogMessageDefinition[] = [];

    const item = this.extractorHelper.extractItemOrThrow(
      this.inventoryService,
      action.eventId,
      action.actionableDefinition.name
    );

    this.inventoryService.store(actor.id, item);

    const log = target.reactTo(action.actionableDefinition, 'NONE', {});

    if (log) {
      logs.push(createTookLogMessage(actor.name, target.name, log));
    }

    return { logs };
  }
}
