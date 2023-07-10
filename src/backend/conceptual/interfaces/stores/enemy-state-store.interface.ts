import { CharacteristicSetDefinition } from '@definitions/characteristic-set.definition';
import { BehaviorLiteral } from '@literals/behavior.literal';

export interface EnemyStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly actionables: string[];
    readonly killedState: string;
    readonly weaponName: string;
    readonly behavior: BehaviorLiteral;
    readonly characteristics: CharacteristicSetDefinition;
    readonly skills: Map<string, number>;
  }[];
}
