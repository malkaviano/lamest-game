import { Injectable } from '@angular/core';

import { RollService } from '../services/roll.service';
import { ActionableDefinition } from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { DamageDefinition } from '../definitions/damage.definition';
import { EffectEvent } from '../events/effect.event';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { ActorEntity } from '../entities/actor.entity';
import { MasterRuleService } from './master.rule';
import { GameMessagesStore } from '../stores/game-messages.store';
import { ActivationAxiomService } from './axioms/activation.axiom.service';
import { DodgeAxiomService } from './axioms/dodge.axiom.service';
import { ConverterHelper } from '../helpers/converter.helper';

@Injectable({
  providedIn: 'root',
})
export class CombatRule extends MasterRuleService {
  constructor(
    private readonly rollService: RollService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly activationAxiomService: ActivationAxiomService,
    private readonly dodgeAxiomService: DodgeAxiomService,
    private readonly converterHelper: ConverterHelper
  ) {
    super([
      rollService.logMessageProduced$,
      activationAxiomService.logMessageProduced$,
      dodgeAxiomService.logMessageProduced$,
    ]);
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

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
        targetWasHit = this.checkSkill(
          actor,
          skillName,
          targetActor,
          identity.label
        );
      }

      if (usability === 'DISPOSABLE') {
        this.disposeItem(actor, identity.label);
      }

      if (targetWasHit) {
        // TODO: Ask the actor if it wants to dodge, new behavior
        const dodged =
          targetActor &&
          this.dodgeAxiomService.dodge(targetActor, {
            dodgeable,
            dodgesPerformed: extras.targetDodgesPerformed ?? 0,
          });

        if (!dodged) {
          this.applyDamage(target, action.actionableDefinition, damage);
        }
      }
    }

    this.checkIfTargetDied(target);
  }

  private checkIfTargetDied(target: ActionReactiveInterface) {
    if (
      target &&
      target instanceof ActorEntity &&
      target.situation === 'DEAD'
    ) {
      this.ruleLog.next(
        GameMessagesStore.createActorIsDeadLogMessage(target.name)
      );
    }
  }

  private disposeItem(actor: ActorInterface, label: string): void {
    actor.unEquip();

    const logMessage = GameMessagesStore.createLostLogMessage(
      actor.name,
      label
    );

    this.ruleLog.next(logMessage);
  }

  private checkSkill(
    actor: ActorInterface,
    skillName: string,
    target: ActorInterface,
    weaponLabel: string
  ): boolean {
    const { result: actorResult } = this.rollService.actorSkillCheck(
      actor,
      skillName
    );

    const result = actorResult === 'SUCCESS';

    if (result) {
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

    const log = target.reactTo(action, 'SUCCESS', {
      effect: new EffectEvent(damage.effectType, damageAmount),
    });

    if (log) {
      const logMessage = GameMessagesStore.createFreeLogMessage(
        'AFFECTED',
        target.name,
        log
      );

      this.ruleLog.next(logMessage);
    }
  }
}
