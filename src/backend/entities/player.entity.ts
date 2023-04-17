import { CharacterIdentityDefinition } from '../../core/definitions/character-identity.definition';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ClassificationLiteral } from '../../core/literals/classification.literal';
import { emptyState } from '../states/empty.state';
import { ActorEntity } from './actor.entity';
import { ActorIdentityDefinition } from '../../core/definitions/actor-identity.definition';
import { CooldownBehavior } from '../behaviors/cooldown.behavior';
import { AiBehavior } from '../behaviors/ai.behavior';
import { ArrayView } from '../../core/view-models/array.view';
import { AgeLiteral } from '../../core/literals/age.literal';
import { RaceLiteral } from '../../core/literals/race.literal';
import { HeightLiteral } from '../../core/literals/height.literal';
import { WeightLiteral } from '../../core/literals/weight.literal';
import { ActionableEvent } from '../../core/events/actionable.event';
import { PlayerInterface } from '../../core/interfaces/player.interface';

export class PlayerEntity extends ActorEntity implements PlayerInterface {
  private playerAction: ActionableEvent | null;

  private profession: string;

  private age: AgeLiteral;

  private race: RaceLiteral;

  private height: HeightLiteral;

  private weight: WeightLiteral;

  constructor(
    identity: CharacterIdentityDefinition,
    actorBehavior: ActorBehavior,
    equipmentBehavior: EquipmentBehavior,
    cooldownBehavior: CooldownBehavior
  ) {
    super(
      new ActorIdentityDefinition(
        identity.name,
        identity.name,
        identity.name,
        identity.visibility
      ),
      emptyState,
      false,
      actorBehavior,
      equipmentBehavior,
      emptyState,
      {
        cooldownBehavior,
        aiBehavior: AiBehavior.create('PASSIVE', ArrayView.create([])),
      }
    );

    this.playerAction = null;

    this.profession = identity.profession;

    this.age = identity.age;

    this.race = identity.race;

    this.weight = identity.weight;

    this.height = identity.height;
  }

  public get identity(): CharacterIdentityDefinition {
    return new CharacterIdentityDefinition(
      this.name,
      this.profession,
      this.age,
      this.race,
      this.height,
      this.weight,
      this.visibility
    );
  }

  public override get classification(): ClassificationLiteral {
    return 'PLAYER';
  }

  public override action(): ActionableEvent | null {
    if (this.playerAction && this.cooldownBehavior.canAct) {
      const tmp = this.playerAction;

      this.playerAction = null;

      this.cooldownBehavior.acted();

      return tmp;
    }

    return null;
  }

  public playerDecision(event: ActionableEvent | null): void {
    if (this.cooldownBehavior.canAct) {
      this.playerAction = event;
    }
  }
}
