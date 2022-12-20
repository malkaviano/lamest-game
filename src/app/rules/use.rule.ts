import { Injectable } from '@angular/core';

import { UsableDefinition } from '../definitions/usable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { RuleInterface } from '../interfaces/rule.interface';
import { InventoryService } from '../services/inventory.service';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

@Injectable({
  providedIn: 'root',
})
export class UseRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly stringMessagesStoreService: StringMessagesStoreService
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
          this.stringMessagesStoreService.createNotFoundLogMessage(
            actor.name,
            actionableDefinition.label
          ),
        ],
      };
    }

    const logs = [];

    const log = target.reactTo(actionableDefinition, 'USED', { item });

    if (log) {
      logs.push(
        this.stringMessagesStoreService.createFreeLogMessage(
          'USED',
          target.name,
          log
        )
      );
    }

    logs.push(
      this.stringMessagesStoreService.createLostLogMessage(
        actor.name,
        item.identity.label
      )
    );

    return {
      logs,
    };
  }
}
