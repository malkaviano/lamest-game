import { Injectable } from '@angular/core';

import { RollService } from '../services/roll.service';
import { ActionableDefinition } from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { DamageDefinition } from '../definitions/damage.definition';
import { EffectEvent } from '../events/effect.event';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { CheckedHelper } from '../helpers/checked.helper';
import { MasterRuleService } from './master.rule';
import { GameMessagesStore } from '../stores/game-messages.store';
import { ActivationAxiomService } from '../axioms/activation.axiom.service';
import { DodgeAxiomService } from '../axioms/dodge.axiom.service';
import { ConverterHelper } from '../helpers/converter.helper';
import { AffectAxiomService } from '../axioms/affect.axiom.service';
import { ResultLiteral } from '../literals/result.literal';
import { ItemUsabilityLiteral } from '../literals/item-usability';

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

    // CHANGEME: This seems to be in the wrong place.
    actor.changeVisibility('VISIBLE');

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
    }
  }

  private disposeItem(
    actor: ActorInterface,
    usability: ItemUsabilityLiteral,
    label: string
  ): void {
    if (usability === 'DISPOSABLE') {
      actor.unEquip();

      const logMessage = GameMessagesStore.createLostItemLogMessage(
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
      const logMessage = GameMessagesStore.createUsedItemLogMessage(
        actor.name,
        target.name,
        weaponLabel
      );

      this.ruleLog.next(logMessage);
    }

    return result;
  }

  private applyDamage(
    target: ActionReactiveInterface,
    action: ActionableDefinition,
    damage: DamageDefinition
  ): void {
    const damageAmount = this.rollService.roll(damage.diceRoll) + damage.fixed;

    this.affectedAxiomService.affectWith(target, action, 'SUCCESS', {
      effect: new EffectEvent(damage.effectType, damageAmount),
    });
  }
}
