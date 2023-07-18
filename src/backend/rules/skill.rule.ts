import { RollHelper } from '@helpers/roll.helper';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleExtrasInterface } from '@interfaces/rule-extras.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ActionableEvent } from '@events/actionable.event';
import { CheckedService } from '@services/checked.service';
import { RuleResult } from '@results/rule.result';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { GamePredicate } from '@predicates/game.predicate';
import { RuleResultLiteral } from '@literals/rule-result.literal';

export class SkillRule extends RuleAbstraction {
  constructor(
    private readonly rollHelper: RollHelper,
    private readonly checkedService: CheckedService,
    private readonly gamePredicate: GamePredicate
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
  ): RuleResult {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const skillName = event.actionableDefinition.name;

    const canExecute = this.canExecute(actor, skillName);

    this.ruleResult.skillName = skillName;

    this.ruleResult.target = target;

    let status: RuleResultLiteral = 'DENIED';

    if (canExecute) {
      status = 'EXECUTED';

      const { result, roll } = this.rollHelper.actorSkillCheck(
        actor,
        skillName
      );

      this.ruleResult.roll = { result, checkRoll: roll };

      this.affectWith(target, event.actionableDefinition, result, {
        actor,
        target,
      });
    }

    return this.getResult(event, actor, status);
  }

  private canExecute(actor: ActorInterface, skillName?: string) {
    return !skillName || this.gamePredicate.canUseSkill(actor, skillName);
  }
}
