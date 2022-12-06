import { ActionableDefinition } from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';

export interface ReactAction {
  reactTo(
    selected: ActionableDefinition,
    result: ResultLiteral,
    value?: number
  ): string | undefined;
}
