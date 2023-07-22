import { ConverterHelper } from '@helpers/converter.helper';
import { RuleResult } from '@results/rule.result';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { GameStringsStore } from '@stores/game-strings.store';
import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PolicyResult } from '@results/policy.result';
import { SettingsStore } from '@stores/settings.store';
import { ActorInterface } from '@interfaces/actor.interface';
import { ArrayView } from '@wrappers/array.view';
import { RuleNameLiteral } from '@literals/rule-name.literal';

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
    const visibilityResult = this.checkVisibility(
      targetActor,
      ruleResult,
      SettingsStore.settings.visibilityBreak.target.disguised,
      SettingsStore.settings.visibilityBreak.target.hidden
    );

    if (visibilityResult) {
      visibility.target = visibilityResult;
    }
  }

  private checkActorVisibility(
    ruleResult: RuleResult,
    visibility: {
      actor?: VisibilityLiteral;
      target?: VisibilityLiteral;
    }
  ) {
    const visibilityResult = this.checkVisibility(
      ruleResult.actor,
      ruleResult,
      SettingsStore.settings.visibilityBreak.actor.disguised,
      SettingsStore.settings.visibilityBreak.actor.hidden
    );

    if (visibilityResult) {
      visibility.actor = visibilityResult;
    }
  }

  private checkVisibility(
    actor: ActorInterface,
    ruleResult: RuleResult,
    disguised: ArrayView<RuleNameLiteral>,
    hidden: ArrayView<RuleNameLiteral>
  ): VisibilityLiteral | undefined {
    let result: VisibilityLiteral | undefined;

    if (ruleResult.result !== 'DENIED') {
      if (
        (actor.visibility === 'DISGUISED' &&
          disguised.items.includes(ruleResult.name)) ||
        (actor.visibility === 'HIDDEN' &&
          hidden.items.includes(ruleResult.name))
      ) {
        result = 'VISIBLE';
      }
    }

    return result;
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
