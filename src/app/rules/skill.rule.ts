import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';

import { RollService } from '../services/roll.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { CheckedHelper } from '../helpers/checked.helper';

import { MasterRuleService } from './master.rule';
import { AffectAxiomService } from '../axioms/affect.axiom.service';

@Injectable({
  providedIn: 'root',
})
export class SkillRule extends MasterRuleService {
  constructor(
    private readonly rollService: RollService,
    private readonly checkedHelper: CheckedHelper,
    private readonly affectAxiomService: AffectAxiomService
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
          actorVisibility: actor,
          target,
        }
      );
    }
  }
}
