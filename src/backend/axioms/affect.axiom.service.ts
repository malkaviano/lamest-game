import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { ActionableDefinition } from '../../core/definitions/actionable.definition';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { InteractiveInterface } from '../../core/interfaces/interactive.interface';
import { LoggerInterface } from '../../core/interfaces/logger.interface';
import { ReactionValuesInterface } from '../../core/interfaces/reaction-values.interface';
import { ResultLiteral } from '../../core/literals/result.literal';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActorEntity } from '../../core/entities/actor.entity';

@Injectable({
  providedIn: 'root',
})
export class AffectAxiomService implements LoggerInterface {
  private readonly logMessageProduced: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor() {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public affectWith(
    actor: InteractiveInterface,
    action: ActionableDefinition,
    rollResult: ResultLiteral,
    values: ReactionValuesInterface
  ): void {
    const log = actor.reactTo(action, rollResult, values);

    if (log) {
      const logMessage = GameStringsStore.createFreeLogMessage(
        'AFFECTED',
        actor.name,
        log
      );

      this.logMessageProduced.next(logMessage);

      if (actor && actor instanceof ActorEntity && actor.situation === 'DEAD') {
        this.logMessageProduced.next(
          GameStringsStore.createActorIsDeadLogMessage(actor.name)
        );
      }
    }
  }
}
