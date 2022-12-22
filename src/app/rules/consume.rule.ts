import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { RollService } from '../services/roll.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { EffectEvent } from '../events/effect.event';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { MasterRuleService } from './master.rule.service';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableDefinition } from '../definitions/actionable.definition';

@Injectable({
  providedIn: 'root',
})
export class ConsumeRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rollRule: RollService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {
    super();
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
      rollResult = this.checkSkill(actor, consumable.skillName);
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
    const logMessage = this.stringMessagesStoreService.createConsumedLogMessage(
      actor.name,
      consumable.identity.label
    );

    this.ruleLog.next(logMessage);

    const hp = consumable.hp;

    const energy = consumable.energy;

    const log = actor.reactTo(actionableDefinition, rollResult, {
      effect: new EffectEvent(consumable.effect, hp),
      energy,
    });

    if (log) {
      const logMessage = this.stringMessagesStoreService.createFreeLogMessage(
        'CONSUMED',
        actor.name,
        log
      );

      this.ruleLog.next(logMessage);
    }
  }

  private checkSkill(actor: ActorInterface, skillName: string): ResultLiteral {
    const rollDefinition = this.rollRule.actorSkillCheck(actor, skillName);

    const rollResult = rollDefinition.result;

    if (rollDefinition.result === 'IMPOSSIBLE') {
      const logMessage =
        this.stringMessagesStoreService.createCannotCheckSkillLogMessage(
          actor.name,
          skillName
        );

      this.ruleLog.next(logMessage);
    } else {
      const logMessage =
        this.stringMessagesStoreService.createSkillCheckLogMessage(
          actor.name,
          skillName,
          rollDefinition.roll.toString(),
          rollDefinition.result
        );

      this.ruleLog.next(logMessage);
    }
    return rollResult;
  }
}
