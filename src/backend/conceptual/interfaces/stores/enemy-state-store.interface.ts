import { CharacteristicValues } from '@values/characteristic-set.definition';
import { BehaviorLiteral } from '@literals/behavior.literal';

export interface EnemyStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly actionables: string[];
    readonly lootState: string;
    readonly weaponName: string;
    readonly behavior: BehaviorLiteral;
    readonly characteristics: CharacteristicValues;
    readonly skills: Map<string, number>;
  }[];
}
