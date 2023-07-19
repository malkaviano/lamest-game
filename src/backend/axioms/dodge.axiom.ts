import { ActorInterface } from '@interfaces/actor.interface';
import { RollHelper } from '@helpers/roll.helper';
import { GamePredicate } from '@predicates/game.predicate';
import { SettingsStore } from '@stores/settings.store';

export class DodgeAxiom {
  constructor(
    private readonly rollService: RollHelper,
    private readonly gamePredicate: GamePredicate
  ) {}

  public dodged(target: ActorInterface, actionDodgeable: boolean): boolean {
    const dodged =
      this.gamePredicate.canDodge(target, actionDodgeable) &&
      this.checkDodge(target);

    return dodged;
  }

  private checkDodge(targetActor: ActorInterface) {
    const { result: dodgeResult } = this.rollService.actorSkillCheck(
      targetActor,
      SettingsStore.settings.systemSkills.dodgeSkill
    );

    return dodgeResult === 'SUCCESS';
  }
}
