import { Injectable } from '@angular/core';

import { ConsumableDefinition } from '../definitions/consumable.definition';
import { ActionableEvent } from '../events/actionable.event';

import { InventoryService } from '../services/inventory.service';

import { RollService } from '../services/roll.service';
import { RollDefinition } from '../definitions/roll.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { EffectEvent } from '../events/effect.event';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { MasterRuleService } from './master.rule.service';

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

    const hp = consumable.hp;

    const energy = consumable.energy;

    let rollDefinition: RollDefinition = new RollDefinition('NONE', 0);

    if (consumable.skillName) {
      rollDefinition = this.rollRule.actorSkillCheck(
        actor,
        consumable.skillName
      );
    }

    if (rollDefinition.result !== 'IMPOSSIBLE') {
      const logMessage =
        this.stringMessagesStoreService.createConsumedLogMessage(
          actor.name,
          consumable.identity.label
        );

      this.ruleLog.next(logMessage);

      if (rollDefinition.result !== 'NONE' && consumable.skillName) {
        const logMessage =
          this.stringMessagesStoreService.createSkillCheckLogMessage(
            actor.name,
            consumable.skillName,
            rollDefinition.roll.toString(),
            rollDefinition.result
          );

        this.ruleLog.next(logMessage);
      }

      const log = actor.reactTo(actionableDefinition, rollDefinition.result, {
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
    } else if (consumable.skillName) {
      const logMessage =
        this.stringMessagesStoreService.createCannotCheckSkillLogMessage(
          actor.name,
          consumable.skillName
        );

      this.ruleLog.next(logMessage);
    }
  }
}
