import { Observable, merge } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { LoggerInterface } from '@interfaces/logger.interface';
import { PolicyInterface } from '@interfaces/policy.interface';
import { RuleResult } from '@results/rule.result';
import { ArrayView } from '@wrappers/array.view';
import { ActionableDefinition } from '@definitions/actionable.definition';
import { InteractiveInterface } from '@interfaces/interactive.interface';

export class PolicyHub implements LoggerInterface {
  private readonly policies: ArrayView<PolicyInterface>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(..._policies: PolicyInterface[]) {
    this.policies = ArrayView.fromArray(_policies);

    this.logMessageProduced$ = merge(
      ...this.policies.items.map((p) => p.logMessageProduced$)
    );
  }

  public enforcePolicies(
    ruleResult: RuleResult,
    action: ActionableDefinition,
    invisibleInteractives: ArrayView<InteractiveInterface>
  ): void {
    this.policies.items.forEach((p) =>
      p.enforce(ruleResult, { invisibleInteractives })
    );
  }
}
