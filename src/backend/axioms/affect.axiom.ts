import { Observable, Subject } from 'rxjs';

import { ActionableDefinition } from '@definitions/actionable.definition';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { LoggerInterface } from '@interfaces/logger.interface';
import { ReactionValuesInterface } from '@interfaces/reaction-values.interface';
import { GameStringsStore } from '@stores/game-strings.store';
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
    target: InteractiveInterface,
    action: ActionableDefinition,
    rollResult: CheckResultLiteral,
    values: ReactionValuesInterface
  ): void {
    const log = target.reactTo(action, rollResult, values);

    if (log) {
      const logMessage = GameStringsStore.createFreeLogMessage(
        'AFFECTED',
        target.name,
        log
      );

      this.logMessageProduced.next(logMessage);

      if (
        target &&
        target instanceof ActorEntity &&
        target.situation === 'DEAD'
      ) {
        this.logMessageProduced.next(
          GameStringsStore.createActorIsDeadLogMessage(target.name)
        );
      }
    }
  }
}
