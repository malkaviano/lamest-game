import { ActionableEvent } from '../events/actionable.event';
import { ActorSituationLiteral } from '../literals/actor-situation.literal';
import { ArrayView } from '../views/array.view';
import { ActionReactiveInterface } from './action-reactive.interface';
import { ActorCooldownInterface } from './actor-cooldown.interface';
import { ActorDefenseInterface } from './actor-defense.interface';
import { ActorEventsInterface } from './actor-events.interface';
import { ActorVisibilityInterface } from './actor-visibility.interface';
import { SceneActorsInfoInterface } from './scene-actors.interface';
import { WeaponEquippedInterface } from './weapon-equipped.interface';
import { WithCharacteristicsInterface } from './with-characteristics.interface';
import { WithDerivedAttibutesInterface } from './with-derived-attributes.interface';
import { WithSkillsInterface } from './with-skills.interface';

export interface ActorInterface
  extends WithCharacteristicsInterface,
    WithDerivedAttibutesInterface,
    WithSkillsInterface,
    WeaponEquippedInterface,
    ActionReactiveInterface,
    ActorDefenseInterface,
    ActorVisibilityInterface,
    ActorEventsInterface,
    ActorCooldownInterface {
  action(
    sceneActorsInfo: ArrayView<SceneActorsInfoInterface>
  ): ActionableEvent | null;

  get situation(): ActorSituationLiteral;
}
