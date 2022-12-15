import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { ArrayView } from '../views/array.view';

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
    readonly immunities: ArrayView<EffectTypeLiteral>;
    readonly cures: ArrayView<EffectTypeLiteral>;
    readonly vulnerabilities: ArrayView<EffectTypeLiteral>;
    readonly resistances: ArrayView<EffectTypeLiteral>;
  }[];
}
