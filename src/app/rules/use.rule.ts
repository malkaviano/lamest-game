import { Injectable } from '@angular/core';

import { UsableDefinition } from '../definitions/usable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { CheckedHelper } from '../helpers/checked.helper';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';

import { InventoryService } from '../services/inventory.service';
import { GameMessagesStore } from '../stores/game-messages.store';
import { AffectAxiomService } from './axioms/affect.axiom.service';

import { MasterRuleService } from './master.rule';

@Injectable({
  providedIn: 'root',
})
export class UseRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedHelper: CheckedHelper,
    private readonly affectAxiomService: AffectAxiomService
  ) {
    super([affectAxiomService.logMessageProduced$]);
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.checkedHelper.getRuleTargetOrThrow(extras);

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
    } else {
      const logMessage = GameMessagesStore.createLostLogMessage(
        actor.name,
        item.identity.label
      );

      this.ruleLog.next(logMessage);

      this.affectAxiomService.affectWith(target, actionableDefinition, 'USED', {
        item,
      });
    }
  }
}
