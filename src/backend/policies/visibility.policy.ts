import { ConverterHelper } from '@helpers/converter.helper';
import { RuleResult } from '@results/rule.result';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { GameStringsStore } from '@stores/game-strings.store';
import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PolicyResult } from '@results/policy.result';
import { SettingsStore } from '@stores/settings.store';
import { ActorInterface } from '@interfaces/actor.interface';

export class VisibilityPolicy extends PolicyAbstraction {
  public override enforce(ruleResult: RuleResult): PolicyResult {
    const visibility: {
      actor?: VisibilityLiteral;
      target?: VisibilityLiteral;
    } = {};

    const targetActor = ConverterHelper.asActor(ruleResult.target);

    if (
      ruleResult.result === 'EXECUTED' &&
      ruleResult.roll?.result === 'SUCCESS'
    ) {
      switch (ruleResult.skillName) {
        case SettingsStore.settings.systemSkills.disguiseSkill:
          visibility.actor = 'DISGUISED';
          break;
        case SettingsStore.settings.systemSkills.stealthSkill:
          visibility.actor = 'HIDDEN';
          break;
        case SettingsStore.settings.systemSkills.detectSkill:
          if (targetActor && targetActor?.visibility !== 'VISIBLE') {
            visibility.target = 'VISIBLE';
          }
          break;
      }
    }

    this.checkActorVisibility(ruleResult, visibility);

    if (visibility.actor) {
      ruleResult.actor.changeVisibility(visibility.actor);

      this.logVisibilityChange(ruleResult.actor, visibility.actor);
    }

    if (targetActor) {
      this.checkTargetVisibility(targetActor, ruleResult, visibility);

      if (visibility.target) {
        targetActor.changeVisibility(visibility.target);

        this.logVisibilityChange(targetActor, visibility.target);
      }
    }

    return { visibility };
  }

  private checkTargetVisibility(
    targetActor: ActorInterface,
    ruleResult: RuleResult,
    visibility: {
      actor?: VisibilityLiteral;
      target?: VisibilityLiteral;
    }
  ) {
    if (targetActor?.visibility !== 'VISIBLE' && ruleResult.effect) {
      visibility.target = 'VISIBLE';
    }
  }

  private checkActorVisibility(
    ruleResult: RuleResult,
    visibility: {
      actor?: VisibilityLiteral;
      target?: VisibilityLiteral;
    }
  ) {
    if (ruleResult.result !== 'DENIED') {
      if (
        (ruleResult.actor.visibility === 'DISGUISED' &&
          SettingsStore.settings.actorVisibilityBreak.disguised.items.includes(
            ruleResult.name
          )) ||
        (ruleResult.actor.visibility === 'HIDDEN' &&
          SettingsStore.settings.actorVisibilityBreak.hidden.items.includes(
            ruleResult.name
          ))
      ) {
        visibility.actor = 'VISIBLE';
      }
    }
  }

  private logVisibilityChange(
    actor: ActorInterface,
    change: VisibilityLiteral
  ) {
    const logMessage = GameStringsStore.createVisibilityChangedLogMessage(
      actor.name,
      change
    );

    this.logMessageProduced.next(logMessage);
  }
}
