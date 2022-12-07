import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';

export interface ActorStoreInterface {
  readonly actors: {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly state: string;
    readonly resettable: boolean;
    readonly characteristics: CharacteristicSetDefinition;
    readonly skills: Map<SkillNameLiteral, number>;
    readonly equippedWeapon: string;
  }[];
}
