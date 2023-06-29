import { CheckResultLiteral } from '../literals/check-result.literal';

export class RollDefinition {
  constructor(
    public readonly result: CheckResultLiteral,
    public readonly roll: number
  ) {}
}
