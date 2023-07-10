import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '@events/actionable.event';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';

export class UnEquipRule extends RuleAbstraction {
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
