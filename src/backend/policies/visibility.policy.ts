import { ConverterHelper } from '@helpers/converter.helper';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { PolicyResultInterface } from '@interfaces/policy-result.interface';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { GameStringsStore } from '@stores/game-strings.store';
import { PolicyAbstraction } from '@abstractions/policy.abstraction';

export class VisibilityPolicy extends PolicyAbstraction {
  public override enforce(
    ruleResult: RuleResultInterface
  ): PolicyResultInterface {
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
      ruleResult.name === 'SKILL' &&
      ruleResult.result === 'EXECUTED' &&
      ruleResult.roll?.result === 'SUCCESS'
    ) {
      switch (ruleResult.skillName) {
        case 'Disguise':
          ruleResult.actor.changeVisibility('DISGUISED');
          result.actor = 'DISGUISED';
          break;
        case 'Hide':
          ruleResult.actor.changeVisibility('HIDDEN');
          result.actor = 'HIDDEN';
          break;
        case 'Detect':
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
