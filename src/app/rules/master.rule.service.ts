import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { DocumentOpenedInterface } from '../interfaces/reader-dialog.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';

import { RuleInterface } from '../interfaces/rule.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class MasterRuleService implements RuleInterface {
  protected readonly ruleLog: Subject<LogMessageDefinition>;

  protected readonly actorDodged: Subject<string>;

  protected readonly documentOpened: Subject<DocumentOpenedInterface>;

  public readonly ruleLog$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  public readonly documentOpened$: Observable<DocumentOpenedInterface>;

  constructor() {
    this.ruleLog = new Subject();

    this.ruleLog$ = this.ruleLog.asObservable();

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
