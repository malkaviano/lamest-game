import { Observable, Subject } from 'rxjs';
import { LogMessageDefinition } from '@conceptual/definitions/log-message.definition';
import { PolicyResultInterface } from '@conceptual/interfaces/policy-result.interface';
import { PolicyInterface } from '@conceptual/interfaces/policy.interface';
import { RuleResultInterface } from '@conceptual/interfaces/rule-result.interface';

export abstract class MasterPolicy implements PolicyInterface {
  protected readonly logMessageProduced: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor() {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public abstract enforce(result: RuleResultInterface): PolicyResultInterface;
}
