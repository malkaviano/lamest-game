import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { SkillNameLiteral } from '../literals/skill-name.literal';

export interface ActorStoreInterface {
  readonly actors: {
    id: string;
    name: string;
    description: string;
    state: string;
    resettable: boolean;
    characteristics: CharacteristicSetDefinition;
    skills: Map<SkillNameLiteral, number>;
  }[];
}
