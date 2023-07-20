import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { PolicyResult } from '@results/policy.result';
import { PolicyInterface } from '@interfaces/policy.interface';
import { RuleResult } from '@results/rule.result';
import { ActionableDefinition } from '@definitions/actionable.definition';

export abstract class PolicyAbstraction implements PolicyInterface {
  protected readonly logMessageProduced: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor() {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public abstract enforce(
    result: RuleResult,
    action: ActionableDefinition
  ): PolicyResult;
}
