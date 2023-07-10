import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActorDodgedInterface } from '@interfaces/actor-dodged.interface';
import { ActorInterface } from '@interfaces/actor.interface';
import { LoggerInterface } from '@interfaces/logger.interface';
import { RollHelper } from '../../backend/helpers/roll.helper';
import { GamePredicate } from '../predicates/game.predicate';

export class DodgeAxiom implements LoggerInterface, ActorDodgedInterface {
  private readonly logMessageProduced: Subject<LogMessageDefinition>;

  private readonly actorDodged: Subject<string>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  constructor(
    private readonly rollService: RollHelper,
    private readonly gamePredicate: GamePredicate
  ) {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();

    this.actorDodged = new Subject();

    this.actorDodged$ = this.actorDodged.asObservable();
  }

  public dodged(
    target: ActorInterface,
    actionDodgeable: boolean,
    dodgesPerformed: number
  ): boolean {
    const dodged =
      this.gamePredicate.canDodge(target, actionDodgeable, dodgesPerformed) &&
      this.checkDodge(target);

    return dodged;
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
