import { CharacteristicNameLiteral } from '@literals/characteristic-name.literal';

export class CharacteristicDefinition {
  constructor(
    public readonly key: CharacteristicNameLiteral,
    public readonly value: number
  ) {}
}
