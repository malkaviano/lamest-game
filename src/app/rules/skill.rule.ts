import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';

import { RollService } from '../services/roll.service';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';

import { MasterRuleService } from './master.rule';
import { AffectAxiomService } from './axioms/affect.axiom.service';

@Injectable({
  providedIn: 'root',
})
export class SkillRule extends MasterRuleService {
  constructor(
    private readonly rollService: RollService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly affectAxiomService: AffectAxiomService
  ) {
    super([affectAxiomService.logMessageProduced$]);
  }

  public execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

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
