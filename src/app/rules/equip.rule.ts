import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { InventoryService } from '../services/inventory.service';
import { ItemStore } from '../stores/item.store';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { StringMessagesStoreService } from '../stores/string-messages.store.service';

@Injectable({
  providedIn: 'root',
})
export class EquipRule implements RuleInterface {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly itemStore: ItemStore,
    private readonly extractorHelper: ExtractorHelper,
    private readonly stringMessagesStoreService: StringMessagesStoreService
  ) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent
  ): RuleResultInterface {
    const logs: LogMessageDefinition[] = [];

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

        logs.push(
          this.stringMessagesStoreService.createUnEquippedLogMessage(
            actor.name,
            previous.identity.label
          )
        );
      }

      logs.push(
        this.stringMessagesStoreService.createEquippedLogMessage(
          actor.name,
          weapon.identity.label
        )
      );
    } else if (skillName) {
      logs.push(
        this.stringMessagesStoreService.createEquipErrorLogMessage(
          actor.name,
          skillName,
          this.itemStore.itemLabel(action.eventId)
        )
      );
    }

    return { logs };
  }
}
