import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { EnemyAttack } from '../interfaces/enemy-attack.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ActionableState } from '../states/actionable.state';
import { InteractiveEntity } from './interactive.entity';

export class NpcEntity extends InteractiveEntity implements ActorInterface {
  constructor(
    id: string,
    name: string,
    description: string,
    currentState: ActionableState,
    resettable: boolean,
    private readonly actorBehavior: ActorBehavior,
    private readonly equipmentBehavior: EquipmentBehavior
  ) {
    super(id, name, description, currentState, resettable);
  }

  public get weaponEquipped(): WeaponDefinition {
    throw new Error('Method not implemented.');
  }

  public get characteristics(): CharacteristicSetDefinition {
    return this.actorBehavior.characteristics;
  }

  public get derivedAttributes(): DerivedAttributeSetDefinition {
    return this.actorBehavior.derivedAttributes;
  }

  public get skills(): KeyValueInterface<number> {
    return this.actorBehavior.skills;
  }

  public get attack(): EnemyAttack | null {
    return this.currentState.attack;
  }

  public equip(weapon: WeaponDefinition): WeaponDefinition | null {
    throw new Error('Method not implemented.');
  }

  public unEquip(): WeaponDefinition | null {
    throw new Error('Method not implemented.');
  }
}
