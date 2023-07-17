import { GameItemLiteral } from '@literals/game-item.literal';
import { PreviousCurrentEventAbstraction } from '@abstractions/previous-current-event.abstraction';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { ArmorDefinition } from '@definitions/armor.definition';

export abstract class EquipmentChangedEvent<
  Item
> extends PreviousCurrentEventAbstraction<GameItemLiteral, Item> {}

export class WeaponChangedEvent extends EquipmentChangedEvent<WeaponDefinition> {
  constructor(previous: WeaponDefinition, current: WeaponDefinition) {
    super('WEAPON', previous, current);
  }
}

export class ArmorChangedEvent extends EquipmentChangedEvent<ArmorDefinition> {
  constructor(previous: ArmorDefinition, current: ArmorDefinition) {
    super('ARMOR', previous, current);
  }
}
