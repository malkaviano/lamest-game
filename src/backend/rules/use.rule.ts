import { Injectable } from '@angular/core';

import { UsableDefinition } from '../../core/definitions/usable.definition';
import { CheckedHelper } from '../helpers/checked.helper';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { InventoryService } from '../services/inventory.service';
import { GameStringsStore } from '../../stores/game-strings.store';
import { AffectAxiomService } from '../axioms/affect.axiom.service';
import { MasterRuleService } from './master.rule';
import { ActionableEvent } from '../../core/events/actionable.event';

@Injectable({
  providedIn: 'root',
})
export class UseRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedHelper: CheckedHelper,
    private readonly affectAxiomService: AffectAxiomService
  ) {
    super();
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
      const logMessage = GameStringsStore.createNotFoundLogMessage(
        actor.name,
        actionableDefinition.label
      );

      this.ruleLog.next(logMessage);
    } else {
      const logMessage = GameStringsStore.createLostItemLogMessage(
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
