import { LogCategoryLiteral } from '@literals/log-category.literal';

export class LogMessageDefinition {
  constructor(
    public readonly category: LogCategoryLiteral,
    public readonly actor: string,
    public readonly message: string
  ) {}
}
