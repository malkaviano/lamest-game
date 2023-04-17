import { Injectable } from '@angular/core';

import { RollService } from '../services/roll.service';
import { ActionableDefinition } from '../../core/definitions/actionable.definition';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { InteractiveInterface } from '../../core/interfaces/interactive.interface';
import { DamageDefinition } from '../../core/definitions/damage.definition';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { CheckedHelper } from '../helpers/checked.helper';
import { MasterRuleService } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActivationAxiomService } from '../axioms/activation.axiom.service';
import { DodgeAxiomService } from '../axioms/dodge.axiom.service';
import { ConverterHelper } from '../helpers/converter.helper';
import { AffectAxiomService } from '../axioms/affect.axiom.service';
import { ResultLiteral } from '../../core/literals/result.literal';
import { ItemUsabilityLiteral } from '../../core/literals/item-usability';
import { ActionableEvent } from '../../core/events/actionable.event';
import { EffectEvent } from '../../core/events/effect.event';

@Injectable({
  providedIn: 'root',
})
export class CombatRule extends MasterRuleService {
  constructor(
    private readonly rollService: RollService,
    private readonly checkedHelper: CheckedHelper,
    private readonly activationAxiomService: ActivationAxiomService,
    private readonly dodgeAxiomService: DodgeAxiomService,
    private readonly affectedAxiomService: AffectAxiomService,
    private readonly converterHelper: ConverterHelper
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.checkedHelper.getRuleTargetOrThrow(extras);

    const {
      dodgeable,
      damage,
      skillName,
      identity,
      usability,
      energyActivation,
    } = actor.weaponEquipped;

    if (
      this.activationAxiomService.activation(actor, {
        identity,
        energyActivation,
      })
    ) {
      let targetWasHit = true;

      const targetActor = this.converterHelper.asActor(target);

      if (targetActor) {
        const actionResult = this.checkSkill(
          actor,
          skillName,
          targetActor,
          identity.label
        );

        targetWasHit = actionResult === 'SUCCESS';

        if (actionResult !== 'IMPOSSIBLE') {
          this.disposeItem(actor, usability, identity.label);
        }
      }

      if (targetWasHit) {
        const dodged =
          targetActor &&
          targetActor.wannaDodge(damage.effectType) &&
          this.dodgeAxiomService.dodge(targetActor, {
            dodgeable,
            dodgesPerformed: extras.targetDodgesPerformed ?? 0,
          });

        if (!dodged) {
          this.applyDamage(target, action.actionableDefinition, damage);
        }
      }

      actor.changeVisibility('VISIBLE');

      targetActor?.afflictedBy(actor.id);

      targetActor?.changeVisibility('VISIBLE');
    }
  }

  private disposeItem(
    actor: ActorInterface,
    usability: ItemUsabilityLiteral,
    label: string
  ): void {
    if (usability === 'DISPOSABLE') {
      actor.unEquip();

      const logMessage = GameStringsStore.createLostItemLogMessage(
        actor.name,
        label
      );

      this.ruleLog.next(logMessage);
    }
  }

  private checkSkill(
    actor: ActorInterface,
    skillName: string,
    target: ActorInterface,
    weaponLabel: string
  ): ResultLiteral {
    const { result } = this.rollService.actorSkillCheck(actor, skillName);

    if (result === 'SUCCESS') {
      const logMessage = GameStringsStore.createUsedItemLogMessage(
        actor.name,
        target.name,
        weaponLabel
      );

      this.ruleLog.next(logMessage);
    }

    return result;
  }

  private applyDamage(
    target: InteractiveInterface,
    action: ActionableDefinition,
    damage: DamageDefinition
  ): void {
    const damageAmount = this.rollService.roll(damage.diceRoll) + damage.fixed;

    this.affectedAxiomService.affectWith(target, action, 'SUCCESS', {
      effect: new EffectEvent(damage.effectType, damageAmount),
    });
  }
}
