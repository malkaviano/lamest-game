import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { CheckedHelper } from '../helpers/checked.helper';

import { MasterRuleService } from './master.rule';
import { GameMessagesStore } from '../stores/game-messages.store';

@Injectable({
  providedIn: 'root',
})
export class EquipRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedHelper: CheckedHelper
  ) {
    super();
  }

  public execute(actor: ActorInterface, action: ActionableEvent): void {
    const item = this.inventoryService.look<WeaponDefinition>(
      actor.id,
      action.eventId
    );

    if (!item) {
      throw new Error(GameMessagesStore.errorMessages['WRONG-ITEM']);
    }

    const skillName = item.skillName;

    if (actor.skills[skillName] > 0) {
      const weapon = this.checkedHelper.takeItemOrThrow<WeaponDefinition>(
        this.inventoryService,
        actor.id,
        action.eventId
      );

      const previous = actor.equip(weapon);

      if (previous) {
        this.inventoryService.store(actor.id, previous);

        const logMessage = GameMessagesStore.createUnEquippedLogMessage(
          actor.name,
          previous.identity.label
        );

        this.ruleLog.next(logMessage);
      }

      const logMessage = GameMessagesStore.createEquippedLogMessage(
        actor.name,
        weapon.identity.label
      );

      this.ruleLog.next(logMessage);
    } else {
      const logMessage = GameMessagesStore.createEquipErrorLogMessage(
        actor.name,
        skillName,
        item.identity.label
      );

      this.ruleLog.next(logMessage);
    }
  }
}
