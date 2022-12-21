import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActionableEvent } from '../events/actionable.event';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import { RuleInterface } from '../interfaces/rule.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class MasterRuleService implements RuleInterface {
  protected readonly ruleLog: Subject<LogMessageDefinition>;

  protected readonly actorDodged: Subject<string>;

  public readonly ruleLog$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  constructor() {
    this.ruleLog = new Subject();

    this.ruleLog$ = this.ruleLog.asObservable();

    this.actorDodged = new Subject();

    this.actorDodged$ = this.actorDodged.asObservable();
  }

  public abstract execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface;
}
