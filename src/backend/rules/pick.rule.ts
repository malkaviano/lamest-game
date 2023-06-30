import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { MasterRule } from './master.rule';
import { AffectAxiom } from '../../core/axioms/affect.axiom';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

export class PickRule extends MasterRule {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService,
    private readonly affectAxiomService: AffectAxiom
  ) {
    super();
  }

  public override get name(): string {
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

    return {
      name: 'PICK',
      event,
      actor,
      target,
      picked: item,
      result: 'EXECUTED',
    };
  }
}
