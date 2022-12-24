import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';

import { InventoryService } from '../services/inventory.service';

import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';

import { MasterRuleService } from './master.rule';
import { AffectAxiomService } from './axioms/affect.axiom.service';

@Injectable({
  providedIn: 'root',
})
export class PickRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly affectAxiomService: AffectAxiomService
  ) {
    super([affectAxiomService.logMessageProduced$]);
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const item = this.extractorHelper.extractItemOrThrow(
      this.inventoryService,
      action.eventId,
      action.actionableDefinition.name
    );

    this.inventoryService.store(actor.id, item);

    this.affectAxiomService.affectWith(
      target,
      action.actionableDefinition,
      'NONE',
      {}
    );
  }
}
