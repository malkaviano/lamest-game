import { ActorIdentityDefinition } from '@definitions/actor-identity.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ConverterHelper } from '@helpers/converter.helper';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { ItemStore } from '@stores/item.store';
import { ResourcesStore } from '@stores/resources.store';
import { SkillStore } from '@stores/skill.store';
import { StatesStore } from '@stores/states.store';
import { ArrayView } from '@wrappers/array.view';
import { ActorEntity } from '@entities/actor.entity';
import { ActorBehavior } from '@behaviors/actor.behavior';
import { EquipmentBehavior } from '@behaviors/equipment.behavior';
import { RegeneratorBehavior } from '@behaviors/regenerator.behavior';
import { AiBehavior } from '@behaviors/ai.behavior';
import { SimpleState } from '@states/simple.state';
import { affectActionable } from '@definitions/actionable.definition';
import { CooldownBehavior } from '@behaviors/cooldown.behavior';

export class ActorStore {
  private readonly store: Map<string, ActorEntity>;

  constructor(
    stateStore: StatesStore,
    resourcesStore: ResourcesStore,
    itemStore: ItemStore,
    skillStore: SkillStore
  ) {
    this.store = new Map<string, ActorEntity>();

    resourcesStore.actorStore.actors.forEach(
      ({
        id,
        name,
        description,
        characteristics,
        skills,
        equippedWeapon,
        lootState,
        aiBehavior,
        ignores,
        visibility,
      }) => {
        const actor = new ActorEntity(
          new ActorIdentityDefinition(id, name, description, visibility),
          new SimpleState(ArrayView.create(affectActionable)),
          ActorBehavior.create(characteristics, skills, skillStore),
          EquipmentBehavior.create(),
          stateStore.states[lootState],
          {
            regeneratorBehavior: new RegeneratorBehavior(),
            aiBehavior: AiBehavior.create(
              aiBehavior,
              ArrayView.fromArray(ignores)
            ),
            cooldownBehavior: new CooldownBehavior(id, 500),
          }
        );

        actor.equip(itemStore.items[equippedWeapon] as WeaponDefinition);

        this.store.set(id, actor);
      }
    );
  }

  public get actors(): ReadonlyKeyValueWrapper<ActorEntity> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }
}
