import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { MasterRule } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

export class UnEquipRule extends MasterRule {
  constructor(private readonly inventoryService: InventoryService) {
    super();
  }

  public override get name(): string {
    return 'UNEQUIP';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResultInterface {
    const weapon = actor.unEquip();

    const result: RuleResultInterface = {
      event,
      result: 'DENIED',
      actor,
    };

    if (weapon) {
      this.inventoryService.store(actor.id, weapon);

      const logMessage = GameStringsStore.createUnEquippedLogMessage(
        actor.name,
        event.actionableDefinition.label
      );

      this.ruleLog.next(logMessage);

      Object.assign(result, { result: 'UNEQUIPPED', unequipped: weapon });
    }

    return result;
  }
}
