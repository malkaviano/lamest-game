import { InventoryService } from '../services/inventory.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { MasterRuleService } from './master.rule';
import { AffectAxiom } from '../../core/axioms/affect.axiom';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';
import { CheckedService } from '../services/checked.service';

export class PickRule extends MasterRuleService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService,
    private readonly affectAxiomService: AffectAxiom
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const item = this.checkedService.takeItemOrThrow(
      this.inventoryService,
      action.eventId,
      action.actionableDefinition.name
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
      action.actionableDefinition,
      'NONE',
      {}
    );
  }
}
