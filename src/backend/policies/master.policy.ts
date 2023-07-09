import { Observable, Subject } from 'rxjs';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { PolicyResultInterface } from '../../core/interfaces/policy-result.interface';
import { PolicyInterface } from '../../core/interfaces/policy.interface';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

export abstract class MasterPolicy implements PolicyInterface {
  protected readonly logMessageProduced: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor() {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public abstract enforce(result: RuleResultInterface): PolicyResultInterface;
}
