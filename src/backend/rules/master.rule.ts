import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { LoggerInterface } from '../../core/interfaces/logger.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { RuleInterface } from '../../core/interfaces/rule.interface';
import { ActionableEvent } from '../../core/events/actionable.event';

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
