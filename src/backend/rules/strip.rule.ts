import { InventoryService } from '@services/inventory.service';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableEvent } from '@events/actionable.event';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { RuleResult } from '@results/rule.result';

export class StripRule extends RuleAbstraction {
  constructor(private readonly inventoryService: InventoryService) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'STRIP';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResult {
    const armor = actor.strip();

    let ruleResult: RuleResultLiteral = 'DENIED';

    if (armor) {
      this.inventoryService.store(actor.id, armor);

      const logMessage = GameStringsStore.createStripLogMessage(
        actor.name,
        armor.identity.label
      );

      this.ruleLog.next(logMessage);

      this.ruleResult.strip = armor;

      ruleResult = 'EXECUTED';
    }

    return this.getResult(event, actor, ruleResult);
  }
}
