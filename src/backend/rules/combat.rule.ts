import { Injectable } from '@angular/core';

import { RollService } from '../services/roll.service';
import { ActionableDefinition } from '../../core/definitions/actionable.definition';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { InteractiveInterface } from '../../core/interfaces/interactive.interface';
import { DamageDefinition } from '../../core/definitions/damage.definition';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { MasterRuleService } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActivationAxiom } from '../axioms/activation.axiom';
import { DodgeAxiom } from '../axioms/dodge.axiom';
import { AffectAxiom } from '../axioms/affect.axiom';
import { ResultLiteral } from '../../core/literals/result.literal';
import { ItemUsabilityLiteral } from '../../core/literals/item-usability';
import { ActionableEvent } from '../../core/events/actionable.event';
import { EffectEvent } from '../../core/events/effect.event';
import { ConverterHelper } from '../../core/helpers/converter.helper';
import { CheckedService } from '../services/checked.service';

@Injectable({
  providedIn: 'root',
})
export class CombatRule extends MasterRuleService {
  constructor(
    private readonly rollService: RollService,
    private readonly checkedService: CheckedService,
    private readonly activationAxiomService: ActivationAxiom,
    private readonly dodgeAxiomService: DodgeAxiom,
    private readonly affectedAxiomService: AffectAxiom
  ) {
    super();
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

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

      const targetActor = ConverterHelper.asActor(target);

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
