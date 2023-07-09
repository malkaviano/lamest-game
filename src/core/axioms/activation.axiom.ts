import { Observable, Subject } from 'rxjs';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { LoggerInterface } from '../interfaces/logger.interface';
import { GameStringsStore } from '../../stores/game-strings.store';
import { GamePredicate } from '../predicates/game.predicate';

export class ActivationAxiom implements LoggerInterface {
  private readonly logMessageProduced: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(private readonly gamePredicate: GamePredicate) {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public activation(
    actor: ActorInterface,
    energyActivation: number,
    label: string
  ): boolean {
    const canActivate = this.gamePredicate.canActivate(
      actor,
      energyActivation,
      label
    );

    if (energyActivation !== 0 && canActivate) {
      const log = actor.reactTo(
        createActionableDefinition('CONSUME', 'activation', 'Activation'),
        'NONE',
        {
          energy: -energyActivation,
        }
      );

      if (log) {
        const logMessage = GameStringsStore.createEnergySpentLogMessage(
          actor.name,
          log,
          label
        );

        this.logMessageProduced.next(logMessage);
      }
    }

    return canActivate;
  }
}
