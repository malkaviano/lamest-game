import { Injectable } from '@angular/core';

import { RollService } from '../services/roll.service';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { DamageDefinition } from '../definitions/damage.definition';
import { EffectEvent } from '../events/effect.event';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { ActorEntity } from '../entities/actor.entity';
import { MasterRuleService } from './master.rule.service';
import { GameMessagesStoreService } from '../stores/game-messages.store';
import { ActivationAxiomService } from './axioms/activation.axiom.service';

@Injectable({
  providedIn: 'root',
})
export class CombatRule extends MasterRuleService {
  public readonly activationAction: ActionableDefinition;

  constructor(
    private readonly rollService: RollService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly activationAxiomService: ActivationAxiomService
  ) {
    super();

    this.activationAction = createActionableDefinition(
      'CONSUME',
      'activation',
      'Activation'
    );
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

      const targetActor = this.asActor(target);

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
          targetActor && this.tryDodge(targetActor, dodgeable, extras);

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
        GameMessagesStoreService.createActorIsDeadLogMessage(target.name)
      );
    }
  }

  private disposeItem(actor: ActorInterface, label: string): void {
    actor.unEquip();

    const logMessage = GameMessagesStoreService.createLostLogMessage(
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
      const logMessage = GameMessagesStoreService.createUsedItemLogMessage(
        actor.name,
        target.name,
        weaponLabel
      );

      this.ruleLog.next(logMessage);
    }

    return result;
  }

  private tryDodge(
    target: ActorInterface,
    dodgeable: boolean,
    extras: RuleExtrasInterface
  ): boolean {
    if (!dodgeable) {
      const logMessage =
        GameMessagesStoreService.createUnDodgeableAttackLogMessage(target.name);

      this.ruleLog.next(logMessage);
    }

    return (
      dodgeable && this.checkDodged(target, extras.targetDodgesPerformed ?? 0)
    );
  }

  private checkDodged(targetActor: ActorInterface, dodgesPerformed: number) {
    let dodged = targetActor.dodgesPerRound > dodgesPerformed;

    if (dodged) {
      const { result: dodgeResult } = this.rollService.actorSkillCheck(
        targetActor,
        'Dodge'
      );

      dodged = dodgeResult === 'SUCCESS';

      if (dodged) {
        this.actorDodged.next(targetActor.id);
      }
    } else {
      const logMessage = GameMessagesStoreService.createOutOfDodgesLogMessage(
        targetActor.name
      );

      this.ruleLog.next(logMessage);
    }

    return dodged;
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
      const logMessage = GameMessagesStoreService.createFreeLogMessage(
        'ATTACKED',
        target.name,
        log
      );

      this.ruleLog.next(logMessage);
    }
  }

  private asActor(target: ActionReactiveInterface): ActorInterface | null {
    if (
      target instanceof ActorEntity &&
      ['ACTOR', 'PLAYER'].includes(target.classification)
    ) {
      return target;
    }

    return null;
  }
}
