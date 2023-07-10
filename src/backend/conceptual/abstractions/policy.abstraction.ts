import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { PolicyResultInterface } from '@interfaces/policy-result.interface';
import { PolicyInterface } from '@interfaces/policy.interface';
import { RuleResultInterface } from '@interfaces/rule-result.interface';

export abstract class PolicyAbstraction implements PolicyInterface {
  protected readonly logMessageProduced: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor() {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public abstract enforce(result: RuleResultInterface): PolicyResultInterface;
}
