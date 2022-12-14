import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';

export interface ActorStoreInterface {
  readonly actors: {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly resettable: boolean;
    readonly characteristics: CharacteristicSetDefinition;
    readonly skills: Map<string, number>;
    readonly equippedWeapon: string;
    readonly killedState: string;
    readonly behaviorState: string;
  }[];
}
