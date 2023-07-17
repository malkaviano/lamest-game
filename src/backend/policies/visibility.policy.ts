import { ConverterHelper } from '@helpers/converter.helper';
import { RuleResultInterface } from '@interfaces/rule-result.interface';
import { PolicyResultInterface } from '@interfaces/policy-result.interface';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { GameStringsStore } from '@stores/game-strings.store';
import { PolicyAbstraction } from '@abstractions/policy.abstraction';
import { ActorEntity } from '../entities/actor.entity';

export class VisibilityPolicy extends PolicyAbstraction {
  public override enforce(
    ruleResult: RuleResultInterface
  ): PolicyResultInterface {
    const result: {
      actor?: VisibilityLiteral;
      target?: VisibilityLiteral;
    } = {};

    const visibility = 'VISIBLE';

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
          break;
        case 'Hide':
          ruleResult.actor.changeVisibility('HIDDEN');
          break;
        case 'Detect':
          if (ruleResult.target && ruleResult.target instanceof ActorEntity) {
            ruleResult.target.changeVisibility('VISIBLE');
          }
          break;
      }
    }

    if (ruleResult.target) {
      const targetActor = ConverterHelper.asActor(ruleResult.target);

      if (
        targetActor &&
        ruleResult.effect &&
        targetActor.visibility !== visibility
      ) {
        targetActor?.changeVisibility(visibility);

        result.target = visibility;

        const logMessage = GameStringsStore.createVisibilityChangedLogMessage(
          targetActor.name,
          visibility
        );

        this.logMessageProduced.next(logMessage);
      }
    }

    return { visibility: result };
  }
}
