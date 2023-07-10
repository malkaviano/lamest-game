import { ActorInterface } from '@interfaces/actor.interface';
import { RuleExtrasInterface } from '@interfaces/rule-extras.interface';
import { MasterRule } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { AffectAxiom } from '@conceptual/axioms/affect.axiom';
import { RuleNameLiteral } from '@literals/rule-name.literal';

export class InteractionRule extends MasterRule {
  constructor(
    private readonly checkedService: CheckedService,
    private readonly affectAxiomService: AffectAxiom
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'INTERACTION';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const { actionableDefinition } = event;

    const logMessage = GameStringsStore.createFreeLogMessage(
      'INTERACTED',
      actor.name,
      actionableDefinition.label
    );

    this.ruleLog.next(logMessage);

    this.affectAxiomService.affectWith(
      target,
      event.actionableDefinition,
      'NONE',
      {}
    );

    this.ruleResult.target = target;

    return this.getResult(event, actor, 'EXECUTED');
  }
}
