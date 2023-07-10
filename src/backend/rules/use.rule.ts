import { UsableDefinition } from '@core/definitions/usable.definition';
import { ActorInterface } from '@core/interfaces/actor.interface';
import { RuleExtrasInterface } from '@core/interfaces/rule-extras.interface';
import { InventoryService } from '../services/inventory.service';
import { GameStringsStore } from '../../stores/game-strings.store';
import { AffectAxiom } from '@core/axioms/affect.axiom';
import { MasterRule } from './master.rule';
import { ActionableEvent } from '@core/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '@core/interfaces/rule-result.interface';
import { RuleNameLiteral } from '@core/literals/rule-name.literal';
import { RuleResultLiteral } from '@core/literals/rule-result.literal';

export class UseRule extends MasterRule {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly checkedService: CheckedService,
    private readonly affectAxiomService: AffectAxiom
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

      if (used.usability === 'DISPOSABLE') {
        this.checkedService.takeItemOrThrow<UsableDefinition>(
          this.inventoryService,
          actor.id,
          used.identity.name
        );

        const logMessage = GameStringsStore.createLostItemLogMessage(
          actor.name,
          used.identity.label
        );

        this.ruleLog.next(logMessage);
      }

      this.affectAxiomService.affectWith(target, actionableDefinition, 'NONE', {
        item: used,
      });
    }

    return this.getResult(event, actor, ruleResult);
  }
}
