import { ConsumableDefinition } from '@definitions/consumable.definition';
import { EffectDefinition } from '@definitions/effect.definition';
import { createDice } from '@definitions/dice.definition';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { KeyValueInterface } from '@interfaces/key-value.interface';
import { ConverterHelper } from '@helpers/converter.helper';
import { ResourcesStore } from '@stores/resources.store';
import { UsableDefinition } from '@definitions/usable.definition';
import { ItemIdentityDefinition } from '@definitions/item-identity.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ReadableDefinition } from '@definitions/readable.definition';
import { ArrayView } from '@wrappers/array.view';
import { ArmorDefinition } from '@definitions/armor.definition';
import { createDamageReduction } from '@definitions/damage-reduction.definition';

export class ItemStore {
  private readonly store: Map<string, GameItemDefinition>;

  constructor(resourcesStore: ResourcesStore) {
    this.store = new Map<string, GameItemDefinition>();

    this.loadWeapons(resourcesStore);

    this.loadConsumables(resourcesStore);

    this.loadUsables(resourcesStore);

    this.loadReadables(resourcesStore);

    this.loadArmor(resourcesStore);
  }

  public get items(): KeyValueInterface<GameItemDefinition> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }

  private loadConsumables(resourcesStore: ResourcesStore) {
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
  }

  private loadUsables(resourcesStore: ResourcesStore) {
    resourcesStore.usablesStore.usables.forEach((item) => {
      this.store.set(
        item.name,
        new UsableDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          item.usability
        )
      );
    });
  }

  private loadReadables(resourcesStore: ResourcesStore) {
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

  private loadWeapons(resourcesStore: ResourcesStore) {
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
          item.energyActivation,
          item.quality
        )
      );
    });
  }

  private loadArmor(resourcesStore: ResourcesStore) {
    resourcesStore.armorStore.armor.forEach((item) => {
      this.store.set(
        item.name,
        new ArmorDefinition(
          new ItemIdentityDefinition(item.name, item.label, item.description),
          'PERMANENT',
          createDamageReduction(item.damageReduction),
          item.armorPenalty
        )
      );
    });
  }
}
