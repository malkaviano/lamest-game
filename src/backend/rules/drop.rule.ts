import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleResult } from '@results/rule.result';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { ActionableEvent } from '@events/actionable.event';
import { InventoryService } from '@services/inventory.service';
import { CheckedService } from '@services/checked.service';

export class DropRule extends RuleAbstraction {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'DROP';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent
  ): RuleResult {
    this.ruleResult = {};

    const dropped = this.checkedService.lookItemOrThrow(
      this.inventoryService,
      actor.id,
      event.eventId
    );

    return {
      actor,
      name: this.name,
      result: 'EXECUTED',
      event,
      dropped,
    };
  }
}
