import { AgeLiteral } from '../literals/age.literal';
import { HeightLiteral } from '../literals/height.literal';
import { IdentityLiteral } from '../literals/identity.literal';
import { RaceLiteral } from '../literals/race.literal';
import { WeightLiteral } from '../literals/weight.literal';

export class CharacterIdentityDefinition {
  constructor(
    public readonly name: string,
    public readonly profession: string,
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
