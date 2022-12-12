import { ActionableDefinition } from '../definitions/actionable.definition';
import { ClassificationLiteral } from '../literals/classification.literal';
import { ResultLiteral } from '../literals/result.literal';
import { ReactionValuesInterface } from './reaction-values.interface';

export interface ActionReactive {
  get id(): string;

  get name(): string;

  get classification(): ClassificationLiteral;

  reactTo(
    selected: ActionableDefinition,
    result: ResultLiteral,
    values: ReactionValuesInterface
  ): string | undefined;
}
