import { CharacteristicValues } from '@values/characteristic.value';
import { BehaviorLiteral } from '@literals/behavior.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { EffectTypeLiteral } from '@literals/effect-type.literal';

export interface ActorStoreInterface {
  readonly actors: {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly characteristics: CharacteristicValues;
    readonly skills: Map<string, number>;
    readonly equippedWeapon: string;
    readonly lootState: string;
    readonly immunities: EffectTypeLiteral[];
    readonly cures: EffectTypeLiteral[];
    readonly vulnerabilities: EffectTypeLiteral[];
    readonly resistances: EffectTypeLiteral[];
    readonly aiBehavior: BehaviorLiteral;
    readonly ignores: VisibilityLiteral[];
    readonly visibility: VisibilityLiteral;
  }[];
}
