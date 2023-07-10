import { AgeLiteral } from '@literals/age.literal';
import { HeightLiteral } from '@literals/height.literal';
import { RaceLiteral } from '@literals/race.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { WeightLiteral } from '@literals/weight.literal';

export class CharacterIdentityDefinition {
  constructor(
    public readonly name: string,
    public readonly profession: string,
    public readonly age: AgeLiteral,
    public readonly race: RaceLiteral,
    public readonly height: HeightLiteral,
    public readonly weight: WeightLiteral,
    public readonly visibility: VisibilityLiteral
  ) {}
}
