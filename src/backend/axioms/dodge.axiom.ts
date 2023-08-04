import { ActorInterface } from '@interfaces/actor.interface';
import { RpgService } from '@services/rpg.service';
import { GamePredicate } from '@predicates/game.predicate';
import { SettingsStore } from '@stores/settings.store';

export class DodgeAxiom {
  constructor(
    private readonly rollService: RpgService,
    private readonly gamePredicate: GamePredicate
  ) {}

  public dodged(
    target: ActorInterface,
    actionDodgeable: boolean
  ): boolean | undefined {
    let result: boolean | undefined;

    if (this.gamePredicate.canDodge(target, actionDodgeable)) {
      result = this.checkDodge(target);
    }

    return result;
  }

  private checkDodge(targetActor: ActorInterface) {
    const { result: dodgeResult } = this.rollService.actorSkillCheck(
      targetActor,
      SettingsStore.settings.systemSkills.dodgeSkill
    );

    return dodgeResult === 'SUCCESS';
  }
}
