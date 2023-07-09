import { Observable, merge } from 'rxjs';

import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { LoggerInterface } from '../../core/interfaces/logger.interface';
import { GamePredicate } from '../../core/predicates/game.predicate';

export class LoggingHub implements LoggerInterface {
  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(...logProducers: LoggerInterface[]) {
    this.logMessageProduced$ = merge(
      ...logProducers.map((lp) => lp.logMessageProduced$)
    );
  }
}
