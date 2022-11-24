import { ResultLiteral } from '../literals/result.literal';

export class RollDefinition {
  constructor(
    public readonly result: ResultLiteral,
    public readonly roll?: number
  ) {}
}
