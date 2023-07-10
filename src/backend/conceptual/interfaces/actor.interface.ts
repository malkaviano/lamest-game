import { ActionableEvent } from '@events/actionable.event';
import { ActorSituationLiteral } from '@literals/actor-situation.literal';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from './interactive.interface';
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
