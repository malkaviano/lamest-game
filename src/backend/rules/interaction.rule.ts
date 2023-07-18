import { ActorInterface } from '@interfaces/actor.interface';
import { RuleValuesDefinition } from '@definitions/rule-values.definition';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableEvent } from '@events/actionable.event';
import { CheckedService } from '@services/checked.service';
import { RuleResult } from '@results/rule.result';
import { RuleNameLiteral } from '@literals/rule-name.literal';

export class InteractionRule extends RuleAbstraction {
  constructor(private readonly checkedService: CheckedService) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'INTERACTION';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleValuesDefinition
  ): RuleResult {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const { actionableDefinition } = event;

    const logMessage = GameStringsStore.createFreeLogMessage(
      'INTERACTED',
      actor.name,
      actionableDefinition.label
    );

    this.ruleLog.next(logMessage);

    this.affectWith(target, event.actionableDefinition, 'NONE', {});

    this.ruleResult.target = target;

    return this.getResult(event, actor, 'EXECUTED');
  }
}
