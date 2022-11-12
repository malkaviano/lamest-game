import { CharacteristicNameLiteral } from '../literals/characteristic-name.literal';

export class Characteristic {
  constructor(
    public readonly key: CharacteristicNameLiteral,
    public readonly value: number,
    public readonly description: string
  ) {}
}
