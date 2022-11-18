import { AgeLiteral } from '../literals/age.literal';
import { GenderLiteral } from '../literals/gender.literal';
import { HeightLiteral } from '../literals/height.literal';
import { IdentityLiteral } from '../literals/identity.literal';
import { ProfessionLiteral } from '../literals/profession.literal';
import { RaceLiteral } from '../literals/race.literal';
import { WeightLiteral } from '../literals/weight.literal';

export class IdentityDefinition {
  constructor(
    public readonly name: string,
    public readonly profession: ProfessionLiteral,
    public readonly gender: GenderLiteral,
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
  gender: 'Character gender',
  age: 'Character age',
  race: 'Character race',
  height: 'Character height',
  weight: 'Character weight',
};
