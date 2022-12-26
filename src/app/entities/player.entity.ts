import { CharacterIdentityDefinition } from '../definitions/character-identity.definition';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ClassificationLiteral } from '../literals/classification.literal';
import { emptyState } from '../states/empty.state';
import { ActorEntity } from './actor.entity';
import { ActionableEvent } from '../events/actionable.event';
import { ActorIdentityDefinition } from '../definitions/actor-identity.definition';
import { CooldownBehavior } from '../behaviors/cooldown.behavior';

export class PlayerEntity extends ActorEntity {
  private playerAction: ActionableEvent | null;

  constructor(
    public readonly identity: CharacterIdentityDefinition,
    actorBehavior: ActorBehavior,
    equipmentBehavior: EquipmentBehavior,
    cooldownBehavior: CooldownBehavior
  ) {
    super(
      new ActorIdentityDefinition(identity.name, identity.name, ''),
      emptyState,
      false,
      actorBehavior,
      equipmentBehavior,
      emptyState,
      cooldownBehavior
    );

    this.playerAction = null;
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
    this.playerAction = event;
  }
}
