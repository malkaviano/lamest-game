import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { EnemyBehaviorLiteral } from '../literals/enemy-behavior.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';

export interface EnemyStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly actionables: string[];
    readonly killedState: string;
    readonly weaponName: string;
    readonly behavior: EnemyBehaviorLiteral;
    readonly characteristics: CharacteristicSetDefinition;
    readonly skills: Map<SkillNameLiteral, number>;
  }[];
}
