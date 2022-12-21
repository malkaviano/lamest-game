import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';

import { InventoryService } from '../services/inventory.service';
import { ItemStore } from '../stores/item.store';

import { ActorInterface } from '../interfaces/actor.interface';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { MasterRuleService } from './master.rule.service';

@Injectable({
  providedIn: 'root',
})
export class EquipRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly itemStore: ItemStore,
    private readonly extractorHelper: ExtractorHelper,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {
    super();
  }

  public execute(actor: ActorInterface, action: ActionableEvent): void {
    const skillName = this.itemStore.itemSkill(action.eventId);

    if (skillName && actor.skills[skillName] > 0) {
      const weapon = this.extractorHelper.extractItemOrThrow<WeaponDefinition>(
        this.inventoryService,
        actor.id,
        action.eventId
      );

      const previous = actor.equip(weapon);

      if (previous) {
        this.inventoryService.store(actor.id, previous);

        const logMessage =
          this.stringMessagesStoreService.createUnEquippedLogMessage(
            actor.name,
            previous.identity.label
          );

        this.ruleLog.next(logMessage);
      }

      const logMessage =
        this.stringMessagesStoreService.createEquippedLogMessage(
          actor.name,
          weapon.identity.label
        );

      this.ruleLog.next(logMessage);
    } else if (skillName) {
      const logMessage =
        this.stringMessagesStoreService.createEquipErrorLogMessage(
          actor.name,
          skillName,
          this.itemStore.itemLabel(action.eventId)
        );

      this.ruleLog.next(logMessage);
    }
  }
}
