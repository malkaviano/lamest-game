import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '@conceptual/interfaces/actor.interface';
import { MasterRule } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { RuleResultInterface } from '@conceptual/interfaces/rule-result.interface';
import { RuleNameLiteral } from '@conceptual/literals/rule-name.literal';
import { RuleResultLiteral } from '@conceptual/literals/rule-result.literal';

export class UnEquipRule extends MasterRule {
  constructor(private readonly inventoryService: InventoryService) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'UNEQUIP';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResultInterface {
    const weapon = actor.unEquip();

    let ruleResult: RuleResultLiteral = 'DENIED';

    if (weapon) {
      this.inventoryService.store(actor.id, weapon);

      const logMessage = GameStringsStore.createUnEquippedLogMessage(
        actor.name,
        event.actionableDefinition.label
      );

      this.ruleLog.next(logMessage);

      this.ruleResult.unequipped = weapon;

      ruleResult = 'EXECUTED';
    }

    return this.getResult(event, actor, ruleResult);
  }
}
