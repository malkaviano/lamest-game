import { merge, Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorDodgedInterface } from '../interfaces/actor-dodged.interface';
import { ActorInterface } from '../interfaces/actor.interface';
import { DocumentOpenedInterface } from '../interfaces/document-opened.interface';
import { LoggerInterface } from '../interfaces/logger.interface';
import { ReadableInterface } from '../interfaces/readable.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { RuleInterface } from '../interfaces/rule.interface';

export abstract class MasterRuleService
  implements
    RuleInterface,
    LoggerInterface,
    ActorDodgedInterface,
    DocumentOpenedInterface
{
  protected readonly ruleLog: Subject<LogMessageDefinition>;

  protected readonly actorDodged: Subject<string>;

  protected readonly documentOpened: Subject<ReadableInterface>;

  public readonly actorDodged$: Observable<string>;

  public readonly documentOpened$: Observable<ReadableInterface>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(observables: Observable<LogMessageDefinition>[] = []) {
    this.ruleLog = new Subject();

    this.logMessageProduced$ = merge(
      this.ruleLog.asObservable(),
      ...observables
    );

    this.actorDodged = new Subject();

    this.actorDodged$ = this.actorDodged.asObservable();

    this.documentOpened = new Subject();

    this.documentOpened$ = this.documentOpened.asObservable();
  }

  public abstract execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): void;
}
