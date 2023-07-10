import { RollHelper } from '@core/helpers/roll.helper';
import { ActorInterface } from '@core/interfaces/actor.interface';
import { RuleExtrasInterface } from '@core/interfaces/rule-extras.interface';
import { MasterRule } from './master.rule';
import { AffectAxiom } from '@core/axioms/affect.axiom';
import { ActionableEvent } from '@core/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '@core/interfaces/rule-result.interface';
import { RuleNameLiteral } from '@core/literals/rule-name.literal';

export class SkillRule extends MasterRule {
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
