import { ActionableEvent } from '../events/actionable.event';
import { ActorSituationLiteral } from '../literals/actor-situation.literal';
import { ArrayView } from '../views/array.view';
import { ActionReactive } from './action-reactive.interface';
import { SceneActorsInfoInterface } from './scene-actors.interface';
import { WeaponEquipped } from './weapon-equipped.interface';
import { WithCharacteristicsInterface } from './with-characteristics.interface';
import { WithDerivedAttibutesInterface } from './with-derived-attributes.interface';
import { WithSkillsInterface } from './with-skills.interface';

export interface ActorInterface
  extends WithCharacteristicsInterface,
    WithDerivedAttibutesInterface,
    WithSkillsInterface,
    WeaponEquipped,
    ActionReactive {
  action(
    sceneActorsInfo: ArrayView<SceneActorsInfoInterface>
  ): ActionableEvent | null;

  get situation(): ActorSituationLiteral;
}
