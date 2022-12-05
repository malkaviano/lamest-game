import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { EnemyBehaviorLiteral } from '../literals/enemy-behavior.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';

export interface EnemyStateStoreInterface {
  readonly states: {
    interactiveId: string;
    actionables: string[];
    killedState: string;
    weaponName: string;
    behavior: EnemyBehaviorLiteral;
    characteristics: CharacteristicSetDefinition;
    skills: Map<SkillNameLiteral, number>;
  }[];
}
