import { Injectable } from '@angular/core';

import { UsableDefinition } from '../definitions/usable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';

import { InventoryService } from '../services/inventory.service';
import { GameMessagesStore } from '../stores/game-messages.store';

import { MasterRuleService } from './master.rule';

@Injectable({
  providedIn: 'root',
})
export class UseRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly extractorHelper: ExtractorHelper
  ) {
    super();
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const { actionableDefinition } = event;

    const item = this.inventoryService.take<UsableDefinition>(
      actor.id,
      actionableDefinition.name
    );

    if (!item) {
      const logMessage = GameMessagesStore.createNotFoundLogMessage(
        actor.name,
        actionableDefinition.label
      );

      this.ruleLog.next(logMessage);

      return;
    }

    const log = target.reactTo(actionableDefinition, 'USED', { item });

    if (log) {
      const logMessage = GameMessagesStore.createFreeLogMessage(
        'USED',
        target.name,
        log
      );

      this.ruleLog.next(logMessage);
    }

    const logMessage = GameMessagesStore.createLostLogMessage(
      actor.name,
      item.identity.label
    );

    this.ruleLog.next(logMessage);
  }
}
