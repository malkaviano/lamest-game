import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '../../definitions/log-message.definition';
import { ActorDodgedInterface } from '../../interfaces/actor-dodged.interface';
import { ActorInterface } from '../../interfaces/actor.interface';
import { LoggerInterface } from '../../interfaces/logger.interface';
import { RollService } from '../../services/roll.service';
import { GameMessagesStoreService } from '../../stores/game-messages.store';

@Injectable({
  providedIn: 'root',
})
export class DodgeAxiomService
  implements LoggerInterface, ActorDodgedInterface
{
  private readonly logMessageProduced: Subject<LogMessageDefinition>;

  private readonly actorDodged: Subject<string>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  constructor(private readonly rollService: RollService) {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();

    this.actorDodged = new Subject();

    this.actorDodged$ = this.actorDodged.asObservable();
  }

  public dodge(
    target: ActorInterface,
    action: { dodgeable: boolean; dodgesPerformed: number }
  ): boolean {
    const { dodgeable, dodgesPerformed } = action;

    const canDodge = target.dodgesPerRound > dodgesPerformed;

    if (!dodgeable) {
      const logMessage =
        GameMessagesStoreService.createUnDodgeableAttackLogMessage(target.name);

      this.logMessageProduced.next(logMessage);
    } else if (!canDodge) {
      const logMessage = GameMessagesStoreService.createOutOfDodgesLogMessage(
        target.name
      );

      this.logMessageProduced.next(logMessage);
    }

    return dodgeable && canDodge && this.checkDodge(target);
  }

  private checkDodge(targetActor: ActorInterface) {
    const { result: dodgeResult } = this.rollService.actorSkillCheck(
      targetActor,
      'Dodge'
    );

    const dodged = dodgeResult === 'SUCCESS';

    if (dodged) {
      this.actorDodged.next(targetActor.id);
    }

    return dodged;
  }
}
