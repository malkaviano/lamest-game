import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { WeaponDefinition } from '../../core/definitions/weapon.definition';
import { MasterRuleService } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';
import { CheckedService } from '../services/checked.service';

export class EquipRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService
  ) {
    super();
  }

  public execute(actor: ActorInterface, action: ActionableEvent): void {
    const item = this.inventoryService.look<WeaponDefinition>(
      actor.id,
      action.eventId
    );

    if (!item) {
      throw new Error(GameStringsStore.errorMessages['WRONG-ITEM']);
    }

    const skillName = item.skillName;

    if (actor.skills[skillName] > 0) {
      const weapon = this.checkedService.takeItemOrThrow<WeaponDefinition>(
        this.inventoryService,
        actor.id,
        action.eventId
      );

      const previous = actor.equip(weapon);

      if (previous) {
        this.inventoryService.store(actor.id, previous);

        const logMessage = GameStringsStore.createUnEquippedLogMessage(
          actor.name,
          previous.identity.label
        );

        this.ruleLog.next(logMessage);
      }

      const logMessage = GameStringsStore.createEquippedLogMessage(
        actor.name,
        weapon.identity.label
      );

      this.ruleLog.next(logMessage);
    } else {
      const logMessage = GameStringsStore.createEquipErrorLogMessage(
        actor.name,
        skillName,
        item.identity.label
      );

      this.ruleLog.next(logMessage);
    }
  }
}
