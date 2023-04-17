import { Injectable } from '@angular/core';

import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { CheckedHelper } from '../helpers/checked.helper';
import { MasterRuleService } from './master.rule';
import { AffectAxiomService } from '../axioms/affect.axiom.service';
import { GameStringsStore } from '../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';

@Injectable({
  providedIn: 'root',
})
export class PickRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedHelper: CheckedHelper,
    private readonly affectAxiomService: AffectAxiomService
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.checkedHelper.getRuleTargetOrThrow(extras);

    const item = this.checkedHelper.takeItemOrThrow(
      this.inventoryService,
      action.eventId,
      action.actionableDefinition.name
    );

    this.inventoryService.store(actor.id, item);

    this.ruleLog.next(
      GameStringsStore.createTookLogMessage(
        actor.name,
        target.name,
        item.identity.label
      )
    );

    this.affectAxiomService.affectWith(
      target,
      action.actionableDefinition,
      'NONE',
      {}
    );
  }
}
