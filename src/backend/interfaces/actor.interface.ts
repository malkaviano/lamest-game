import { ActionableEvent } from '@events/actionable.event';
import { ActorSituationLiteral } from '@literals/actor-situation.literal';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActorDefenseInterface } from '@interfaces/actor-defense.interface';
import { ActorEventsInterface } from '@interfaces/actor-events.interface';
import { SceneActorsInfoValues } from '@values/scene-actors.value';
import { WeaponEquippedInterface } from '@interfaces/weapon-equipped.interface';
import { WithCharacteristicsInterface } from '@interfaces/with-characteristics.interface';
import { WithDerivedAttributesInterface } from '@interfaces/with-derived-attributes.interface';
import { WithSkillsInterface } from '@interfaces/with-skills.interface';
import { ArmorWearingInterface } from '@interfaces/armor-wearing.interface';

export interface ActorInterface
  extends WithCharacteristicsInterface,
    WithDerivedAttributesInterface,
    WithSkillsInterface,
    WeaponEquippedInterface,
    ArmorWearingInterface,
    InteractiveInterface,
    ActorDefenseInterface,
    ActorEventsInterface {
  action(
    sceneActorsInfo: ArrayView<SceneActorsInfoValues>
  ): ActionableEvent | null;

  afflictedBy(actorId: string): void;

  get situation(): ActorSituationLiteral;
}
