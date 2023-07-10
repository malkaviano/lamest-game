import { RollHelper } from '@conceptual/helpers/roll.helper';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleExtrasInterface } from '@interfaces/rule-extras.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { AffectAxiom } from '@conceptual/axioms/affect.axiom';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { RuleNameLiteral } from '@literals/rule-name.literal';

export class SkillRule extends RuleAbstraction {
  constructor(
    private readonly rollHelper: RollHelper,
    private readonly checkedService: CheckedService,
    private readonly affectAxiomService: AffectAxiom
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'SKILL';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const skillName = event.actionableDefinition.name;

    const { result, roll } = this.rollHelper.actorSkillCheck(actor, skillName);

    this.ruleResult.skillName = skillName;

    this.ruleResult.checkRoll = roll;

    this.ruleResult.target = target;

    if (result !== 'IMPOSSIBLE') {
      this.affectAxiomService.affectWith(
        target,
        event.actionableDefinition,
        result,
        {
          actor,
          target,
        }
      );
    }

    return this.getResult(event, actor, 'EXECUTED');
  }
}
