import { IdentityDefinition } from '../definitions/identity.definition';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ClassificationLiteral } from '../literals/classification.literal';
import { emptyState } from '../states/empty.state';
import { ActorEntity } from './actor.entity';
import { ActionableEvent } from '../events/actionable.event';

export class PlayerEntity extends ActorEntity {
  private playerAction: ActionableEvent | null;

  constructor(
    public readonly identity: IdentityDefinition,
    actorBehavior: ActorBehavior,
    equipmentBehavior: EquipmentBehavior
  ) {
    super(
      identity.name,
      identity.name,
      '',
      emptyState,
      false,
      actorBehavior,
      equipmentBehavior,
      emptyState
    );

    this.playerAction = null;
  }

  public override get classification(): ClassificationLiteral {
    return 'PLAYER';
  }

  public override get action(): ActionableEvent | null {
    return this.playerAction;
  }

  public playerDecision(event: ActionableEvent | null): void {
    this.playerAction = event;
  }
}
