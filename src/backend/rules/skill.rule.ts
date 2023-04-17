import { RollHelper } from '../../core/helpers/roll.helper';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { MasterRuleService } from './master.rule';
import { AffectAxiom } from '../../core/axioms/affect.axiom';
import { ActionableEvent } from '../../core/events/actionable.event';
import { CheckedService } from '../services/checked.service';

export class SkillRule extends MasterRuleService {
  constructor(
    private readonly rollHelper: RollHelper,
    private readonly checkedService: CheckedService,
    private readonly affectAxiomService: AffectAxiom
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    const skillName = event.actionableDefinition.name;

    const { result } = this.rollHelper.actorSkillCheck(actor, skillName);

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
  }
}
