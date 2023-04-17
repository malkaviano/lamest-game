import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { LoggerInterface } from '../interfaces/logger.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { RuleInterface } from '../interfaces/rule.interface';

export abstract class MasterRuleService
  implements RuleInterface, LoggerInterface
{
  protected readonly ruleLog: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor() {
    this.ruleLog = new Subject();

    this.logMessageProduced$ = this.ruleLog.asObservable();
  }

  public abstract execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): void;
}
