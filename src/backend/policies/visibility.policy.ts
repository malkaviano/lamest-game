import { ConverterHelper } from '@helpers/converter.helper';
import { RuleResult } from '@results/rule.result';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { GameStringsStore } from '@stores/game-strings.store';
import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { PolicyResult } from '@results/policy.result';
import { SettingsStore } from '@stores/settings.store';

export class VisibilityPolicy extends PolicyAbstraction {
  public override enforce(ruleResult: RuleResult): PolicyResult {
    const result: {
      actor?: VisibilityLiteral;
      target?: VisibilityLiteral;
    } = {};

    const visibility = 'VISIBLE';

    const targetActor = ConverterHelper.asActor(ruleResult.target);

    if (
      ruleResult.name === 'AFFECT' &&
      ruleResult.actor.visibility !== visibility
    ) {
      ruleResult.actor.changeVisibility(visibility);

      result.actor = visibility;

      const logMessage = GameStringsStore.createVisibilityChangedLogMessage(
        ruleResult.actor.name,
        visibility
      );

      this.logMessageProduced.next(logMessage);
    } else if (
      ruleResult.result === 'EXECUTED' &&
      ruleResult.roll?.result === 'SUCCESS'
    ) {
      switch (ruleResult.skillName) {
        case SettingsStore.settings.systemSkills.disguiseSkill:
          ruleResult.actor.changeVisibility('DISGUISED');
          result.actor = 'DISGUISED';
          break;
        case SettingsStore.settings.systemSkills.stealthSkill:
          ruleResult.actor.changeVisibility('HIDDEN');
          result.actor = 'HIDDEN';
          break;
        case SettingsStore.settings.systemSkills.detectSkill:
          if (targetActor && targetActor?.visibility !== visibility) {
            targetActor.changeVisibility('VISIBLE');
            result.target = 'VISIBLE';
          }
          break;
      }
    }

    if (
      ruleResult.effect &&
      targetActor &&
      targetActor?.visibility !== visibility
    ) {
      targetActor?.changeVisibility(visibility);

      result.target = visibility;

      const logMessage = GameStringsStore.createVisibilityChangedLogMessage(
        targetActor.name,
        visibility
      );

      this.logMessageProduced.next(logMessage);
    }

    return { visibility: result };
  }
}
