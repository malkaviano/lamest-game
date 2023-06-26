import { UsableDefinition } from '../../core/definitions/usable.definition';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { InventoryService } from '../services/inventory.service';
import { GameStringsStore } from '../../stores/game-strings.store';
import { AffectAxiom } from '../../core/axioms/affect.axiom';
import { MasterRule } from './master.rule';
import { ActionableEvent } from '../../core/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

export class UseRule extends MasterRule {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService,
    private readonly affectAxiomService: AffectAxiom
  ) {
    super();
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const { actionableDefinition } = event;

    // FIXME: Use checked service and check if DISPOSABLE
    const used = this.inventoryService.take<UsableDefinition>(
      actor.id,
      actionableDefinition.name
    );

    const result: RuleResultInterface = {
      event,
      result: 'DENIED',
      actor,
      target,
    };

    if (!used) {
      const logMessage = GameStringsStore.createNotFoundLogMessage(
        actor.name,
        actionableDefinition.label
      );

      this.ruleLog.next(logMessage);
    } else {
      Object.assign(result, { result: 'USED', used });

      const logMessage = GameStringsStore.createLostItemLogMessage(
        actor.name,
        used.identity.label
      );

      this.ruleLog.next(logMessage);

      this.affectAxiomService.affectWith(target, actionableDefinition, 'USED', {
        item: used,
      });
    }

    return result;
  }
}
