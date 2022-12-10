import { AgeLiteral } from '../literals/age.literal';
import { HeightLiteral } from '../literals/height.literal';
import { IdentityLiteral } from '../literals/identity.literal';
import { ProfessionLiteral } from '../literals/profession.literal';
import { RaceLiteral } from '../literals/race.literal';
import { WeightLiteral } from '../literals/weight.literal';

export class CharacterIdentityDefinition {
  constructor(
    public readonly name: string,
    public readonly profession: ProfessionLiteral,
    public readonly age: AgeLiteral,
    public readonly race: RaceLiteral,
    public readonly height: HeightLiteral,
    public readonly weight: WeightLiteral
  ) {}
}

export const characterIdentityDefinitions: {
  [key in IdentityLiteral]: string;
} = {
  name: 'Character name',
  profession: 'Character profession',
  age: 'Character age',
  race: 'Character race',
  height: 'Character height',
  weight: 'Character weight',
};
