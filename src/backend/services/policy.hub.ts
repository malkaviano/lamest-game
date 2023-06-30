import { Observable, Subject, merge } from 'rxjs';

import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { LoggerInterface } from '../../core/interfaces/logger.interface';
import { PolicyInterface } from '../../core/interfaces/policy.interface';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';
import { ArrayView } from '../../core/view-models/array.view';

export class PolicyHub implements LoggerInterface {
  private readonly policies: ArrayView<PolicyInterface>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(..._policies: PolicyInterface[]) {
    this.policies = ArrayView.create(_policies);

    this.logMessageProduced$ = merge(
      ...this.policies.items.flatMap((p) => p.logMessageProduced$)
    );
  }

  public enforcePolicies(ruleResult: RuleResultInterface): void {
    this.policies.items.forEach((p) => p.enforce(ruleResult));
  }
}
