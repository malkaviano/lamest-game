import { Observable, Subject } from 'rxjs';

import { ConverterHelper } from '../../core/helpers/converter.helper';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';
import { PolicyInterface } from '../../core/interfaces/policy.interface';
import { PolicyResultInterface } from '../../core/interfaces/policy-result.interface';
import { VisibilityLiteral } from '../../core/literals/visibility.literal';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { GameStringsStore } from '../../stores/game-strings.store';

export class VisibilityPolicy implements PolicyInterface {
  private readonly logMessageProduced: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor() {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public enforce(ruleResult: RuleResultInterface): PolicyResultInterface {
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
