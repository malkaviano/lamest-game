import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '@conceptual/interfaces/actor.interface';
import { RuleExtrasInterface } from '@conceptual/interfaces/rule-extras.interface';
import { MasterRule } from './master.rule';
import { AffectAxiom } from '@conceptual/axioms/affect.axiom';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '@conceptual/interfaces/rule-result.interface';
import { RuleNameLiteral } from '@conceptual/literals/rule-name.literal';

export class PickRule extends MasterRule {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService,
    private readonly affectAxiomService: AffectAxiom
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'PICK';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
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

    this.affectAxiomService.affectWith(
      target,
      event.actionableDefinition,
      'NONE',
      {}
    );

    this.ruleResult.picked = item;

    this.ruleResult.target = target;

    return this.getResult(event, actor, 'EXECUTED');
  }
}
