import { ActionableEvent } from '@events/actionable.event';
import { ActorSituationLiteral } from '@literals/actor-situation.literal';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActorDefenseInterface } from '@interfaces/actor-defense.interface';
import { ActorEventsInterface } from '@interfaces/actor-events.interface';
import { ActorVisibilityInterface } from '@interfaces/actor-visibility.interface';
import { SceneActorsInfoInterface } from '@interfaces/scene-actors.interface';
import { WeaponEquippedInterface } from '@interfaces/weapon-equipped.interface';
import { WithCharacteristicsInterface } from '@interfaces/with-characteristics.interface';
import { WithDerivedAttibutesInterface } from '@interfaces/with-derived-attributes.interface';
import { WithSkillsInterface } from '@interfaces/with-skills.interface';

export interface ActorInterface
  extends WithCharacteristicsInterface,
    WithDerivedAttibutesInterface,
    WithSkillsInterface,
    WeaponEquippedInterface,
    InteractiveInterface,
    ActorDefenseInterface,
    ActorVisibilityInterface,
    ActorEventsInterface {
  action(
    sceneActorsInfo: ArrayView<SceneActorsInfoInterface>
  ): ActionableEvent | null;

  afflictedBy(actorId: string): void;

  get situation(): ActorSituationLiteral;
}
