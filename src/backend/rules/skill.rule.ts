import { Injectable } from '@angular/core';

import { RollService } from '../services/roll.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { CheckedHelper } from '../helpers/checked.helper';
import { MasterRuleService } from './master.rule';
import { AffectAxiom } from '../axioms/affect.axiom';
import { ActionableEvent } from '../../core/events/actionable.event';

@Injectable({
  providedIn: 'root',
})
export class SkillRule extends MasterRuleService {
  constructor(
    private readonly rollService: RollService,
    private readonly checkedHelper: CheckedHelper,
    private readonly affectAxiomService: AffectAxiom
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.checkedHelper.getRuleTargetOrThrow(extras);

    const skillName = event.actionableDefinition.name;

    const { result } = this.rollService.actorSkillCheck(actor, skillName);

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
