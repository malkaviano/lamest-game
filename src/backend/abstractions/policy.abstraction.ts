import { Observable, Subject } from 'rxjs';
import { CombatEvent } from '@interfaces/combat-event.interface';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { PolicyResult } from '@results/policy.result';
import { PolicyInterface } from '@interfaces/policy.interface';
import { RuleResult } from '@results/rule.result';
import { PolicyValues } from '@values/policy.values';

export abstract class PolicyAbstraction implements PolicyInterface {
  protected readonly logMessageProduced: Subject<LogMessageDefinition>;
  protected readonly combatEventProduced: Subject<CombatEvent>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;
  public readonly combatEventProduced$: Observable<CombatEvent>;

  constructor() {
    this.logMessageProduced = new Subject();
    this.combatEventProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
    this.combatEventProduced$ = this.combatEventProduced.asObservable();
  }

  public abstract enforce(
    result: RuleResult,
    values: PolicyValues
  ): PolicyResult;
}
