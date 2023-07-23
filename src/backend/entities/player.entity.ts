import { CharacterIdentityDefinition } from '@definitions/character-identity.definition';
import { ActorBehavior } from '@behaviors/actor.behavior';
import { EquipmentBehavior } from '@behaviors/equipment.behavior';
import { ClassificationLiteral } from '@literals/classification.literal';
import { emptyState } from '@states/empty.state';
import { ActorEntity } from '@entities/actor.entity';
import { ActorIdentityDefinition } from '@definitions/actor-identity.definition';
import { RegeneratorBehavior } from '@behaviors/regenerator.behavior';
import { AiBehavior } from '@behaviors/ai.behavior';
import { ArrayView } from '@wrappers/array.view';
import { AgeLiteral } from '@literals/age.literal';
import { RaceLiteral } from '@literals/race.literal';
import { HeightLiteral } from '@literals/height.literal';
import { WeightLiteral } from '@literals/weight.literal';
import { ActionableEvent } from '@events/actionable.event';
import { PlayerInterface } from '@interfaces/player.interface';
import { BehaviorLiteral } from '@literals/behavior.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { CooldownBehavior } from '@behaviors/cooldown.behavior';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';

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
    regeneratorBehavior: RegeneratorBehavior,
    private readonly cooldownBehavior: CooldownBehavior
  ) {
    super(
      new ActorIdentityDefinition(
        identity.name,
        identity.name,
        identity.name,
        identity.visibility
      ),
      emptyState,
      actorBehavior,
      equipmentBehavior,
      emptyState,
      {
        regeneratorBehavior: regeneratorBehavior,
        aiBehavior: AiBehavior.create('PASSIVE', ArrayView.empty()),
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

  public override get behavior(): BehaviorLiteral {
    return 'PLAYER';
  }

  public override get ignores(): ArrayView<VisibilityLiteral> {
    return ArrayView.empty();
  }

  public get cooldowns(): ReadonlyKeyValueWrapper<number> {
    return this.cooldownBehavior.cooldowns;
  }

  public override action(): ActionableEvent | null {
    if (this.playerAction) {
      const tmp = this.playerAction;

      this.playerAction = null;

      return tmp;
    }

    return null;
  }

  public playerDecision(event: ActionableEvent | null): void {
    this.playerAction = event;
  }

  public addCooldown(key: string, durationMilliseconds: number): void {
    this.cooldownBehavior.addCooldown(key, durationMilliseconds);
  }
}
