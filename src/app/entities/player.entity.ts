import { IdentityDefinition } from '../definitions/identity.definition';
import { ActorBehavior } from '../behaviors/actor.behavior';
import { EquipmentBehavior } from '../behaviors/equipment.behavior';
import { ClassificationLiteral } from '../literals/classification.literal';
import { emptyState } from '../states/empty.state';
import { ActorEntity } from './actor.entity';

export class PlayerEntity extends ActorEntity {
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
  }

  public override get classification(): ClassificationLiteral {
    return 'PLAYER';
  }
}
