import { UsableDefinition } from '@definitions/usable.definition';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleExtrasInterface } from '@interfaces/rule-extras.interface';
import { InventoryService } from '@services/inventory.service';
import { GameStringsStore } from '@stores/game-strings.store';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ActionableEvent } from '@events/actionable.event';
import { CheckedService } from '@services/checked.service';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { RuleResultLiteral } from '@literals/rule-result.literal';

export class UseRule extends RuleAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'USE';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const { actionableDefinition } = event;

    const used = this.inventoryService.look<UsableDefinition>(
      actor.id,
      actionableDefinition.name
    );

    let ruleResult: RuleResultLiteral = 'DENIED';

    this.ruleResult.target = target;

    if (!used) {
      const logMessage = GameStringsStore.createNotFoundLogMessage(
        actor.name,
        actionableDefinition.label
      );

      this.ruleLog.next(logMessage);
    } else {
      this.ruleResult.used = used;

      ruleResult = 'EXECUTED';

      this.affectWith(target, actionableDefinition, 'NONE', {
        item: used,
      });
    }

    return this.getResult(event, actor, ruleResult);
  }
}
