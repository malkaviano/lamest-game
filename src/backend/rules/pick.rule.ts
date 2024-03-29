import { InventoryService } from '@services/inventory.service';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleValues } from '@values/rule.value';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableEvent } from '@events/actionable.event';
import { CheckedService } from '@services/checked.service';
import { RuleResult } from '@results/rule.result';
import { RuleNameLiteral } from '@literals/rule-name.literal';

export class PickRule extends RuleAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'PICK';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleValues
  ): RuleResult {
    this.ruleResult = {};

    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const item = this.checkedService.takeItemOrThrow(
      this.inventoryService,
      event.eventId,
      event.actionableDefinition.name
    );

    this.inventoryService.store(actor.id, item);

    this.ruleLog.next(
      GameStringsStore.createTookLogMessage(
        actor.name,
        target.name,
        item.identity.label
      )
    );

    this.ruleResult.picked = item;

    this.ruleResult.target = target;

    return this.getResult(event, actor, 'EXECUTED');
  }
}
