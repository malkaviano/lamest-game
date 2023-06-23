import { Observable, Subject } from 'rxjs';

import { createActionableDefinition } from '../definitions/actionable.definition';
import { ItemIdentityDefinition } from '../definitions/item-identity.definition';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { LoggerInterface } from '../interfaces/logger.interface';
import { GameStringsStore } from '../../stores/game-strings.store';

export class ActivationAxiom implements LoggerInterface {
  private readonly logMessageProduced: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor() {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }

  public activation(
    actor: ActorInterface,
    activatable: {
      readonly identity: ItemIdentityDefinition;
      readonly energyActivation: number;
    }
  ): boolean {
    const energyActivation = Math.abs(activatable.energyActivation);

    const canActivate =
      actor.derivedAttributes['CURRENT EP'].value >= energyActivation;

    if (canActivate) {
      if (energyActivation > 0) {
        const energyCost = -activatable.energyActivation;

        const log = actor.reactTo(
          createActionableDefinition('CONSUME', 'activation', 'Activation'),
          'NONE',
          {
            energy: energyCost,
          }
        );

        if (log) {
          const logMessage = GameStringsStore.createEnergySpentLogMessage(
            actor.name,
            log,
            activatable.identity.label
          );

          this.logMessageProduced.next(logMessage);
        }
      }
    } else {
      const logMessage = GameStringsStore.createNotEnoughEnergyLogMessage(
        actor.name,
        activatable.identity.label
      );

      this.logMessageProduced.next(logMessage);
    }

    return canActivate;
  }
}