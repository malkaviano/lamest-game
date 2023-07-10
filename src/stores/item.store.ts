import { ConsumableDefinition } from '@definitions/consumable.definition';
import { EffectDefinition } from '@definitions/effect.definition';
import { createDice } from '@definitions/dice.definition';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { KeyValueInterface } from '@conceptual/interfaces/key-value.interface';
import { ConverterHelper } from '@conceptual/helpers/converter.helper';
import { ResourcesStore } from './resources.store';
import { UsableDefinition } from '@definitions/usable.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ReadableDefinition } from '@definitions/readable.definition';
import { ArrayView } from '@conceptual/view-models/array.view';

export class ItemStore {
  private readonly store: Map<string, GameItemDefinition>;

  constructor(resourcesStore: ResourcesStore) {
    this.store = new Map<string, GameItemDefinition>();

    resourcesStore.weaponStore.weapons.forEach((item) => {
      this.store.set(
        item.name,
        new WeaponDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.skillName,
          new EffectDefinition(
            createDice(item.damage?.dice),
            item.damage.fixed,
            item.damage.effect
          ),
          item.dodgeable,
          item.usability,
          item.energyActivation
        )
      );
    });

    resourcesStore.consumableStore.consumables.forEach((item) => {
      this.store.set(
        item.name,
        new ConsumableDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.hp,
          item.energy,
          item.effect,
          item.skillName
        )
      );
    });

    resourcesStore.usablesStore.usables.forEach((item) => {
      this.store.set(
        item.name,
        new UsableDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.usability
        )
      );
    });

    resourcesStore.readableStore.readables.forEach((item) => {
      this.store.set(
        item.name,
        new ReadableDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.title,
          ArrayView.fromArray(item.text),
          item.usability
        )
      );
    });
  }

  public get items(): KeyValueInterface<GameItemDefinition> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }
}
