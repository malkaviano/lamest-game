import { ActorInterface } from '@interfaces/actor.interface';
import { RollHelper } from '@helpers/roll.helper';
import { GamePredicate } from '@predicates/game.predicate';

export class DodgeAxiom {
  constructor(
    private readonly rollService: RollHelper,
    private readonly gamePredicate: GamePredicate
  ) {}

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

    return dodgeResult === 'SUCCESS';
  }
}
