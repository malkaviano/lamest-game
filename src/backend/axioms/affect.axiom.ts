import { Observable, Subject } from 'rxjs';

import { ActionableDefinition } from '@definitions/actionable.definition';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { LoggerInterface } from '@interfaces/logger.interface';
import { ReactionValuesInterface } from '@interfaces/reaction-values.interface';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActorEntity } from '@entities/actor.entity';
import { CheckResultLiteral } from '@literals/check-result.literal';

export class AffectAxiom implements LoggerInterface {
  private readonly logMessageProduced: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor() {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public affectWith(
    actor: InteractiveInterface,
    action: ActionableDefinition,
    rollResult: CheckResultLiteral,
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
