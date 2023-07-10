import { Observable, merge } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { LoggerInterface } from '@conceptual/interfaces/logger.interface';
import { PolicyInterface } from '@conceptual/interfaces/policy.interface';
import { RuleResultInterface } from '@conceptual/interfaces/rule-result.interface';
import { ArrayView } from '@wrappers/array.view';

export class PolicyHub implements LoggerInterface {
  private readonly policies: ArrayView<PolicyInterface>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(..._policies: PolicyInterface[]) {
    this.policies = ArrayView.fromArray(_policies);

    this.logMessageProduced$ = merge(
      ...this.policies.items.map((p) => p.logMessageProduced$)
    );
  }

  public enforcePolicies(ruleResult: RuleResultInterface): void {
    this.policies.items.forEach((p) => p.enforce(ruleResult));
  }
}
