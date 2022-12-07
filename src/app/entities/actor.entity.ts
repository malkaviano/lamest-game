import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { DerivedAttributeSetDefinition } from '../definitions/derived-attribute-set.definition';
import { WeaponDefinition } from '../definitions/weapon.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { EnemyAttack } from '../interfaces/enemy-attack.interface';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ClassificationLiteral } from '../literals/classification.literal';
import { ActionableState } from '../states/actionable.state';
import { InteractiveEntity } from './interactive.entity';

export class ActorEntity extends InteractiveEntity implements ActorInterface {
  constructor(
    id: string,
    name: string,
    description: string,
    currentState: ActionableState,
    resettable: boolean,
    protected readonly actorBehavior: ActorBehavior,
    protected readonly equipmentBehavior: EquipmentBehavior
  ) {
    super(id, name, description, currentState, resettable);
  }

  public override get classification(): ClassificationLiteral {
    return 'ACTOR';
  }

  public get action(): ActionableDefinition | null {
    return createActionableDefinition('ATTACK', 'attack', 'Attack');
  }

  public get weaponEquipped(): WeaponDefinition {
    return this.equipmentBehavior.weaponEquipped;
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
    const previous = this.equipmentBehavior.equip(weapon);

    return previous;
  }

  public unEquip(): WeaponDefinition | null {
    const weapon = this.equipmentBehavior.unEquip();

    return weapon;
  }
}
