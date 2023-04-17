import { Observable } from 'rxjs';

import { ActionableDefinition } from '../definitions/actionable.definition';
import { ClassificationLiteral } from '../literals/classification.literal';
import { ResultLiteral } from '../literals/result.literal';
import { ReactionValuesInterface } from './reaction-values.interface';
import { ArrayView } from '../view-models/array.view';

export interface InteractiveInterface {
  get id(): string;

  get name(): string;

  get description(): string;

  get classification(): ClassificationLiteral;

  readonly actionsChanged$: Observable<ArrayView<ActionableDefinition>>;

  reactTo(
    selected: ActionableDefinition,
    result: ResultLiteral,
    values: ReactionValuesInterface
  ): string | null;

  reset(): void;
}
