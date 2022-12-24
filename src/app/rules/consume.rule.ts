import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { RollService } from '../services/roll.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { EffectEvent } from '../events/effect.event';
import { ExtractorHelper } from '../helpers/extractor.helper';

import { MasterRuleService } from './master.rule';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableDefinition } from '../definitions/actionable.definition';
import { GameMessagesStore } from '../stores/game-messages.store';
import { AffectedAxiomService } from './axioms/affected.axiom.service';

@Injectable({
  providedIn: 'root',
})
export class ConsumeRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rollRule: RollService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly affectedAxiom: AffectedAxiomService
  ) {
    super([affectedAxiom.logMessageProduced$]);
  }

  public execute(actor: ActorInterface, event: ActionableEvent): void {
    const { actionableDefinition, eventId } = event;

    const consumable =
      this.extractorHelper.extractItemOrThrow<ConsumableDefinition>(
        this.inventoryService,
        actor.id,
        eventId
      );

    let rollResult: ResultLiteral = 'NONE';

    if (consumable.skillName) {
      rollResult = this.rollRule.actorSkillCheck(
        actor,
        consumable.skillName
      ).result;
    }

    if (['NONE', 'SUCCESS'].includes(rollResult)) {
      this.consume(actor, consumable, actionableDefinition, rollResult);
    }
  }

  private consume(
    actor: ActorInterface,
    consumable: ConsumableDefinition,
    actionableDefinition: ActionableDefinition,
    rollResult: ResultLiteral
  ) {
    const logMessage = GameMessagesStore.createConsumedLogMessage(
      actor.name,
      consumable.identity.label
    );

    this.ruleLog.next(logMessage);

    const hp = consumable.hp;

    const energy = consumable.energy;

    this.affectedAxiom.affectWith(actor, actionableDefinition, rollResult, {
      effect: new EffectEvent(consumable.effect, hp),
      energy,
    });
  }
}
