import { CharacteristicSetDefinition } from '@definitions/characteristic-set.definition';
import { BehaviorLiteral } from '@literals/behavior.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';

export interface ActorStoreInterface {
  readonly actors: {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly characteristics: CharacteristicSetDefinition;
    readonly skills: Map<string, number>;
    readonly equippedWeapon: string;
    readonly lootState: string;
    readonly behaviorState: string;
    readonly aiBehavior: BehaviorLiteral;
    readonly ignores: VisibilityLiteral[];
    readonly visibility: VisibilityLiteral;
  }[];
}
