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
import { StringMessagesStoreService } from '../stores/string-messages.store.service';
import { MasterRuleService } from './master.rule.service';

@Injectable({
  providedIn: 'root',
})
export class CombatRule extends MasterRuleService {
  public readonly activationAction: ActionableDefinition;

  constructor(
    private readonly rollService: RollService,
    private readonly extractorHelper: ExtractorHelper,
    private readonly stringMessagesStoreService: StringMessagesStoreService
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

    if (actor.derivedAttributes.EP.value >= energyActivation) {
      if (energyActivation) {
        this.activateItem(energyActivation, actor, identity.label);
      }

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
    } else {
      const logMessage =
        this.stringMessagesStoreService.createNotEnoughEnergyLogMessage(
          actor.name,
          identity.label
        );

      this.ruleLog.next(logMessage);
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
        this.stringMessagesStoreService.createActorIsDeadLogMessage(target.name)
      );
    }
  }

  private disposeItem(actor: ActorInterface, label: string): void {
    actor.unEquip();

    const logMessage = this.stringMessagesStoreService.createLostLogMessage(
      actor.name,
      label
    );

    this.ruleLog.next(logMessage);
  }

  private activateItem(
    energyActivation: number,
    actor: ActorInterface,
    label: string
  ) {
    const energySpentLog = actor.reactTo(this.activationAction, 'NONE', {
      energy: -energyActivation,
    });

    if (energySpentLog) {
      const logMessage =
        this.stringMessagesStoreService.createEnergySpentLogMessage(
          actor.name,
          energySpentLog,
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
  ): boolean {
    const { result: actorResult, roll: actorRoll } =
      this.rollService.actorSkillCheck(actor, skillName);

    /*
      Due to future circumstances, the equipped item may require a current zero skill value
      TODO: check for impossible
     */

    let logMessage = this.stringMessagesStoreService.createUsedItemLogMessage(
      actor.name,
      target.name,
      weaponLabel
    );

    this.ruleLog.next(logMessage);

    logMessage = this.stringMessagesStoreService.createSkillCheckLogMessage(
      actor.name,
      skillName,
      actorRoll.toString(),
      actorResult
    );

    this.ruleLog.next(logMessage);

    return actorResult === 'SUCCESS';
  }

  private tryDodge(
    target: ActorInterface,
    dodgeable: boolean,
    extras: RuleExtrasInterface
  ): boolean {
    if (!dodgeable) {
      const logMessage =
        this.stringMessagesStoreService.createUnDodgeableAttackLogMessage(
          target.name
        );

      this.ruleLog.next(logMessage);
    }

    return (
      dodgeable && this.checkDodged(target, extras.targetDodgesPerformed ?? 0)
    );
  }

  private checkDodged(targetActor: ActorInterface, dodgesPerformed: number) {
    let dodged = targetActor.dodgesPerRound > dodgesPerformed;

    if (dodged) {
      const { result: dodgeResult, roll: dodgeRoll } =
        this.rollService.actorSkillCheck(targetActor, 'Dodge');

      dodged = dodgeResult === 'SUCCESS';

      if (dodged) {
        this.actorDodged.next(targetActor.id);

        const logMessage =
          this.stringMessagesStoreService.createSkillCheckLogMessage(
            targetActor.name,
            'Dodge',
            dodgeRoll.toString(),
            dodgeResult
          );

        this.ruleLog.next(logMessage);
      } else if (dodgeResult === 'IMPOSSIBLE') {
        const logMessage =
          this.stringMessagesStoreService.createCannotCheckSkillLogMessage(
            targetActor.name,
            'Dodge'
          );

        this.ruleLog.next(logMessage);
      }
    } else {
      const logMessage =
        this.stringMessagesStoreService.createOutOfDodgesLogMessage(
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
      const logMessage = this.stringMessagesStoreService.createFreeLogMessage(
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
